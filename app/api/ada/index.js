// @flow
import { split, get } from 'lodash';
import { action } from 'mobx';
import { ipcRenderer, remote } from 'electron';
import BigNumber from 'bignumber.js';
import { Logger, stringifyData, stringifyError } from '../../utils/logging';
import { unixTimestampToDate } from './lib/utils';
import Wallet from '../../domain/Wallet';
import WalletTransaction, { transactionTypes } from '../../domain/WalletTransaction';
import WalletAddress from '../../domain/WalletAddress';
import { isValidMnemonic } from '../../../lib/decrypt';
import { isValidRedemptionKey, isValidPaperVendRedemptionKey } from '../../../lib/redemption-key-validation';
import { LOVELACES_PER_LUX } from '../../config/numbersConfig';
import { getLuxSyncProgress } from './getLuxSyncProgress';
import environment from '../../environment';
import patchLuxApi from './mocks/patchLuxApi';

import { getLuxWallets } from './getLuxWallets';
import { changeLuxWalletPassphrase } from './changeLuxWalletPassphrase';
import { deleteLuxWallet } from './deleteLuxWallet';
import { newLuxWallet } from './newLuxWallet';
import { newLuxWalletAddress } from './newLuxWalletAddress';
import { restoreLuxWallet } from './restoreLuxWallet';
import { updateLuxWallet } from './updateLuxWallet';
import { exportLuxBackupJSON } from './exportLuxBackupJSON';
import { importLuxBackupJSON } from './importLuxBackupJSON';
import { importLuxWallet } from './importLuxWallet';
import { getLuxWalletAccounts } from './getLuxWalletAccounts';
import { isValidLuxAddress } from './isValidLuxAddress';
import { luxTxFee } from './luxTxFee';
import { newLuxPayment } from './newLuxPayment';
import { redeemLux } from './redeemLux';
import { redeemLuxPaperVend } from './redeemLuxPaperVend';
import { nextLuxUpdate } from './nextLuxUpdate';
import { postponeLuxUpdate } from './postponeLuxUpdate';
import { applyLuxUpdate } from './applyLuxUpdate';
import { luxTestReset } from './luxTestReset';
import { getLuxHistoryByWallet } from './getLuxHistoryByWallet';
import { getLuxAccountRecoveryPhrase } from './getLuxAccountRecoveryPhrase';

import type {
  LuxSyncProgressResponse,
  LuxAddress,
  LuxAccounts,
  LuxTransaction,
  LuxTransactionFee,
  LuxTransactions,
  LuxWallet,
  LuxWallets,
  LuxWalletRecoveryPhraseResponse,
} from './types';

import type {
  CreateWalletRequest,
  CreateWalletResponse,
  CreateTransactionResponse,
  DeleteWalletRequest,
  DeleteWalletResponse,
  GetSyncProgressResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetWalletRecoveryPhraseResponse,
  GetWalletsResponse,
  RestoreWalletRequest,
  RestoreWalletResponse,
  UpdateWalletResponse,
  UpdateWalletPasswordRequest,
  UpdateWalletPasswordResponse,
} from '../common';

import {
  GenericApiError,
  IncorrectWalletPasswordError,
  WalletAlreadyRestoredError,
} from '../common';

import {
  AllFundsAlreadyAtReceiverAddressError,
  NotAllowedToSendMoneyToRedeemAddressError,
  NotAllowedToSendMoneyToSameAddressError,
  NotEnoughFundsForTransactionFeesError,
  NotEnoughMoneyToSendError,
  RedeemLuxError,
  WalletAlreadyImportedError,
  WalletFileImportError,
} from './errors';

/**
 * The api layer that is used for all requests to the
 * luxcoin backend when working with the LUX coin.
 */

const ca = remote.getGlobal('ca');

// LUX specific Request / Response params
export type GetAddressesResponse = {
  accountId: ?string,
  addresses: Array<WalletAddress>,
};
export type GetAddressesRequest = {
  walletId: string,
};
export type CreateAddressResponse = WalletAddress;
export type CreateAddressRequest = {
  accountId: string,
  password: ?string,
};

export type CreateTransactionRequest = {
  sender: string,
  receiver: string,
  amount: string,
  password: ?string,
};
export type UpdateWalletRequest = {
  walletId: string,
  name: string,
  assurance: string,
};
export type RedeemLuxRequest = {
  redemptionCode: string,
  accountId: string,
  walletPassword: ?string,
};
export type RedeemLuxResponse = Wallet;
export type RedeemPaperVendedLuxRequest = {
  shieldedRedemptionKey: string,
  mnemonics: string,
  accountId: string,
  walletPassword: ?string,
};
export type RedeemPaperVendedLuxResponse = RedeemPaperVendedLuxRequest;
export type ImportWalletFromKeyRequest = {
  filePath: string,
  walletPassword: ?string,
};
export type ImportWalletFromKeyResponse = Wallet;
export type ImportWalletFromFileRequest = {
  filePath: string,
  walletPassword: ?string,
  walletName: ?string,
};
export type ImportWalletFromFileResponse = Wallet;
export type NextUpdateResponse = ?{
  version: ?string,
};
export type PostponeUpdateResponse = Promise<void>;
export type ApplyUpdateResponse = Promise<void>;

export type TransactionFeeRequest = {
  sender: string,
  receiver: string,
  amount: string,
};
export type TransactionFeeResponse = BigNumber;
export type ExportWalletToFileRequest = {
  walletId: string,
  filePath: string,
  password: ?string
};
export type ExportWalletToFileResponse = [];
// const notYetImplemented = () => new Promise((_, reject) => {
//   reject(new ApiMethodNotYetImplementedError());
// });

// Commented out helper code for testing async APIs
// (async () => {
//   const result = await ClientApi.nextUpdate();
//   console.log('nextUpdate', result);
// })();

// Commented out helper code for testing sync APIs
// (() => {
//   const result = ClientApi.isValidRedeemCode('HSoXEnt9X541uHvtzBpy8vKfTo1C9TkAX3wat2c6ikg=');
//   console.log('isValidRedeemCode', result);
// })();


export default class LuxApi {

  constructor() {
    if (environment.isTest()) {
      patchLuxApi(this);
    }
  }

  async getWallets(): Promise<GetWalletsResponse> {
    Logger.debug('LuxApi::getWallets called');
    try {
      const response: LuxWallets = await getLuxWallets({ ca });
      Logger.debug('LuxApi::getWallets success: ' + stringifyData(response));
      return response.map(data => _createWalletFromServerData(data));
    } catch (error) {
      Logger.error('LuxApi::getWallets error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async getAddresses(request: GetAddressesRequest): Promise<GetAddressesResponse> {
    Logger.debug('LuxApi::getAddresses called: ' + stringifyData(request));
    const { walletId } = request;
    try {
      const response: LuxAccounts = await getLuxWalletAccounts({ ca, walletId });
      Logger.debug('LuxApi::getAddresses success: ' + stringifyData(response));
      if (!response.length) {
        return new Promise((resolve) => resolve({ accountId: null, addresses: [] }));
      }
      // For now only the first wallet account is used
      const firstAccount = response[0];
      const firstAccountId = firstAccount.caId;
      const firstAccountAddresses = firstAccount.caAddresses;

      return new Promise((resolve) => resolve({
        accountId: firstAccountId,
        addresses: firstAccountAddresses.map(data => _createAddressFromServerData(data)),
      }));
    } catch (error) {
      Logger.error('LuxApi::getAddresses error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async getTransactions(request: GetTransactionsRequest): Promise<GetTransactionsResponse> {
    Logger.debug('LuxApi::searchHistory called: ' + stringifyData(request));
    const { walletId, skip, limit } = request;
    try {
      const history: LuxTransactions = await getLuxHistoryByWallet({ ca, walletId, skip, limit });
      Logger.debug('LuxApi::searchHistory success: ' + stringifyData(history));
      return new Promise((resolve) => resolve({
        transactions: history[0].map(data => _createTransactionFromServerData(data)),
        total: history[1]
      }));
    } catch (error) {
      Logger.error('LuxApi::searchHistory error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse> {
    Logger.debug('LuxApi::createWallet called');
    const { name, mnemonic, password } = request;
    const assurance = 'CWANormal';
    const unit = 0;
    try {
      const walletInitData = {
        cwInitMeta: {
          cwName: name,
          cwAssurance: assurance,
          cwUnit: unit,
        },
        cwBackupPhrase: {
          bpToList: split(mnemonic), // array of mnemonic words
        }
      };
      const wallet: LuxWallet = await newLuxWallet({ ca, password, walletInitData });
      Logger.debug('LuxApi::createWallet success');
      return _createWalletFromServerData(wallet);
    } catch (error) {
      Logger.error('LuxApi::createWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async deleteWallet(request: DeleteWalletRequest): Promise<DeleteWalletResponse> {
    Logger.debug('LuxApi::deleteWallet called: ' + stringifyData(request));
    try {
      const { walletId } = request;
      await deleteLuxWallet({ ca, walletId });
      Logger.debug('LuxApi::deleteWallet success: ' + stringifyData(request));
      return true;
    } catch (error) {
      Logger.error('LuxApi::deleteWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async createTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    Logger.debug('LuxApi::createTransaction called');
    const { sender, receiver, amount, password } = request;
    // sender must be set as accountId (account.caId) and not walletId
    try {
      // default value. Select (OptimizeForSecurity | OptimizeForSize) will be implemented
      const groupingPolicy = 'OptimizeForSecurity';
      const response: LuxTransaction = await newLuxPayment(
        { ca, sender, receiver, amount, groupingPolicy, password }
      );
      Logger.debug('LuxApi::createTransaction success: ' + stringifyData(response));
      return _createTransactionFromServerData(response);
    } catch (error) {
      Logger.error('LuxApi::createTransaction error: ' + stringifyError(error));
      // eslint-disable-next-line max-len
      if (error.message.includes('It\'s not allowed to send money to the same address you are sending from')) {
        throw new NotAllowedToSendMoneyToSameAddressError();
      }
      if (error.message.includes('Destination address can\'t be redeem address')) {
        throw new NotAllowedToSendMoneyToRedeemAddressError();
      }
      if (error.message.includes('Not enough money')) {
        throw new NotEnoughMoneyToSendError();
      }
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  async calculateTransactionFee(request: TransactionFeeRequest): Promise<TransactionFeeResponse> {
    Logger.debug('LuxApi::calculateTransactionFee called');
    const { sender, receiver, amount } = request;
    try {
      // default value. Select (OptimizeForSecurity | OptimizeForSize) will be implemented
      const groupingPolicy = 'OptimizeForSecurity';
      const response: luxTxFee = await luxTxFee(
        { ca, sender, receiver, amount, groupingPolicy }
      );
      Logger.debug('LuxApi::calculateTransactionFee success: ' + stringifyData(response));
      return _createTransactionFeeFromServerData(response);
    } catch (error) {
      Logger.error('LuxApi::calculateTransactionFee error: ' + stringifyError(error));
      // eslint-disable-next-line max-len
      if (error.message.includes('not enough money on addresses which are not included in output addresses set')) {
        throw new AllFundsAlreadyAtReceiverAddressError();
      }
      if (error.message.includes('not enough money')) {
        throw new NotEnoughFundsForTransactionFeesError();
      }
      throw new GenericApiError();
    }
  }

  async createAddress(request: CreateAddressRequest): Promise<CreateAddressResponse> {
    Logger.debug('LuxApi::createAddress called');
    const { accountId, password } = request;
    try {
      const response: LuxAddress = await newLuxWalletAddress(
        { ca, password, accountId }
      );
      Logger.debug('LuxApi::createAddress success: ' + stringifyData(response));
      return _createAddressFromServerData(response);
    } catch (error) {
      Logger.error('LuxApi::createAddress error: ' + stringifyError(error));
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  isValidAddress(address: string): Promise<boolean> {
    return isValidLuxAddress({ ca, address });
  }

  isValidMnemonic(mnemonic: string): Promise<boolean> {
    return isValidMnemonic(mnemonic, 12);
  }

  isValidRedemptionKey(mnemonic: string): Promise<boolean> {
    return isValidRedemptionKey(mnemonic);
  }

  isValidPaperVendRedemptionKey(mnemonic: string): Promise<boolean> {
    return isValidPaperVendRedemptionKey(mnemonic);
  }

  isValidRedemptionMnemonic(mnemonic: string): Promise<boolean> {
    return isValidMnemonic(mnemonic, 9);
  }

  getWalletRecoveryPhrase(): Promise<GetWalletRecoveryPhraseResponse> {
    Logger.debug('LuxApi::getWalletRecoveryPhrase called');
    try {
      const response: Promise<LuxWalletRecoveryPhraseResponse> = new Promise(
        (resolve) => resolve(getLuxAccountRecoveryPhrase())
      );
      Logger.debug('LuxApi::getWalletRecoveryPhrase success');
      return response;
    } catch (error) {
      Logger.error('LuxApi::getWalletRecoveryPhrase error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async restoreWallet(request: RestoreWalletRequest): Promise<RestoreWalletResponse> {
    Logger.debug('LuxApi::restoreWallet called');
    const { recoveryPhrase, walletName, walletPassword } = request;
    const assurance = 'CWANormal';
    const unit = 0;

    const walletInitData = {
      cwInitMeta: {
        cwName: walletName,
        cwAssurance: assurance,
        cwUnit: unit,
      },
      cwBackupPhrase: {
        bpToList: split(recoveryPhrase), // array of mnemonic words
      }
    };

    try {
      const wallet: LuxWallet = await restoreLuxWallet(
        { ca, walletPassword, walletInitData }
      );
      Logger.debug('LuxApi::restoreWallet success');
      return _createWalletFromServerData(wallet);
    } catch (error) {
      Logger.error('LuxApi::restoreWallet error: ' + stringifyError(error));
      // TODO: backend will return something different here, if multiple wallets
      // are restored from the key and if there are duplicate wallets we will get
      // some kind of error and present the user with message that some wallets
      // where not imported/restored if some where. if no wallets are imported
      // we will error out completely with throw block below
      if (error.message.includes('Wallet with that mnemonics already exists')) {
        throw new WalletAlreadyRestoredError();
      }
      // We don't know what the problem was -> throw generic error
      throw new GenericApiError();
    }
  }

  async importWalletFromKey(
    request: ImportWalletFromKeyRequest
  ): Promise<ImportWalletFromKeyResponse> {
    Logger.debug('LuxApi::importWalletFromKey called');
    const { filePath, walletPassword } = request;
    try {
      const importedWallet: LuxWallet = await importLuxWallet(
        { ca, walletPassword, filePath }
      );
      Logger.debug('LuxApi::importWalletFromKey success');
      return _createWalletFromServerData(importedWallet);
    } catch (error) {
      Logger.error('LuxApi::importWalletFromKey error: ' + stringifyError(error));
      if (error.message.includes('already exists')) {
        throw new WalletAlreadyImportedError();
      }
      throw new WalletFileImportError();
    }
  }

  async importWalletFromFile(
    request: ImportWalletFromFileRequest
  ): Promise<ImportWalletFromFileResponse> {
    Logger.debug('LuxApi::importWalletFromFile called');
    const { filePath, walletPassword } = request;
    const isKeyFile = filePath.split('.').pop().toLowerCase() === 'key';
    try {
      const importedWallet: LuxWallet = isKeyFile ? (
        await importLuxWallet({ ca, walletPassword, filePath })
      ) : (
        await importLuxBackupJSON({ ca, filePath })
      );
      Logger.debug('LuxApi::importWalletFromFile success');
      return _createWalletFromServerData(importedWallet);
    } catch (error) {
      Logger.error('LuxApi::importWalletFromFile error: ' + stringifyError(error));
      if (error.message.includes('already exists')) {
        throw new WalletAlreadyImportedError();
      }
      throw new WalletFileImportError();
    }
  }

  async redeemLux(request: RedeemLuxRequest): Promise<RedeemLuxResponse> {
    Logger.debug('LuxApi::redeemLux called');
    const { redemptionCode, accountId, walletPassword } = request;
    try {
      const walletRedeemData = {
        crWalletId: accountId,
        crSeed: redemptionCode,
      };

      const response: LuxTransaction = await redeemLux(
        { ca, walletPassword, walletRedeemData }
      );

      Logger.debug('LuxApi::redeemLux success');
      return _createTransactionFromServerData(response);
    } catch (error) {
      Logger.error('LuxApi::redeemLux error: ' + stringifyError(error));
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new RedeemLuxError();
    }
  }

  async redeemPaperVendedLux(
    request: RedeemPaperVendedLuxRequest
  ): Promise<RedeemPaperVendedLuxResponse> {
    Logger.debug('LuxApi::redeemLuxPaperVend called');
    const { shieldedRedemptionKey, mnemonics, accountId, walletPassword } = request;
    try {
      const redeemPaperVendedData = {
        pvWalletId: accountId,
        pvSeed: shieldedRedemptionKey,
        pvBackupPhrase: {
          bpToList: split(mnemonics),
        }
      };

      const response: LuxTransaction = await redeemLuxPaperVend(
        { ca, walletPassword, redeemPaperVendedData }
      );

      Logger.debug('LuxApi::redeemLuxPaperVend success');
      return _createTransactionFromServerData(response);
    } catch (error) {
      Logger.error('LuxApi::redeemLuxPaperVend error: ' + stringifyError(error));
      if (error.message.includes('Passphrase doesn\'t match')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new RedeemLuxError();
    }
  }

  async nextUpdate(): Promise<NextUpdateResponse> {
    Logger.debug('LuxApi::nextUpdate called');
    let nextUpdate = null;
    try {
      // TODO: add flow type definitions for nextUpdate response
      const response: Promise<any> = await nextLuxUpdate({ ca });
      Logger.debug('LuxApi::nextUpdate success: ' + stringifyData(response));
      if (response && response.cuiSoftwareVersion) {
        nextUpdate = {
          version: get(response, ['cuiSoftwareVersion', 'svNumber'], null)
        };
      }
    } catch (error) {
      if (error.message.includes('No updates available')) {
        Logger.debug('LuxApi::nextUpdate success: No updates available');
      } else {
        Logger.error('LuxApi::nextUpdate error: ' + stringifyError(error));
      }
      // throw new GenericApiError();
    }
    return nextUpdate;
    // TODO: remove hardcoded response after node update is tested
    // nextUpdate = {
    //   cuiSoftwareVersion: {
    //     svAppName: {
    //       getApplicationName: 'luxcoin'
    //     },
    //     svNumber: 1
    //   },
    //   cuiBlockVesion: {
    //     bvMajor: 0,
    //     bvMinor: 1,
    //     bvAlt: 0
    //   },
    //   cuiScriptVersion: 1,
    //   cuiImplicit: false,
    //   cuiVotesFor: 2,
    //   cuiVotesAgainst: 0,
    //   cuiPositiveStake: {
    //     getCoin: 66666
    //   },
    //   cuiNegativeStake: {
    //     getCoin: 0
    //   }
    // };
    // if (nextUpdate && nextUpdate.cuiSoftwareVersion && nextUpdate.cuiSoftwareVersion.svNumber) {
    //   return { version: nextUpdate.cuiSoftwareVersion.svNumber };
    // } else if (nextUpdate) {
    //   return { version: null };
    // }
    // return null;
  }

  async postponeUpdate(): PostponeUpdateResponse {
    Logger.debug('LuxApi::postponeUpdate called');
    try {
      const response: Promise<any> = await postponeLuxUpdate({ ca });
      Logger.debug('LuxApi::postponeUpdate success: ' + stringifyData(response));
    } catch (error) {
      Logger.error('LuxApi::postponeUpdate error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async applyUpdate(): ApplyUpdateResponse {
    Logger.debug('LuxApi::applyUpdate called');
    try {
      const response: Promise<any> = await applyLuxUpdate({ ca });
      Logger.debug('LuxApi::applyUpdate success: ' + stringifyData(response));
      ipcRenderer.send('kill-process');
    } catch (error) {
      Logger.error('LuxApi::applyUpdate error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  getSyncProgress = async (): Promise<GetSyncProgressResponse> => {
    Logger.debug('LuxApi::syncProgress called');

    try {
      const response: LuxSyncProgressResponse = await getLuxSyncProgress({ ca });
      Logger.debug('LuxApi::syncProgress success: ' + stringifyData(response));
      const localDifficulty = response._spLocalCD.getChainDifficulty.getBlockCount;
      // In some cases we dont get network difficulty & we need to wait for it from the notify API
      let networkDifficulty = null;
      if (response._spNetworkCD) {
        networkDifficulty = response._spNetworkCD.getChainDifficulty.getBlockCount;
      }
      return { localDifficulty, networkDifficulty };
    } catch (error) {
      Logger.error('LuxApi::syncProgress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  async updateWallet(request: UpdateWalletRequest): Promise<UpdateWalletResponse> {
    Logger.debug('LuxApi::updateWallet called: ' + stringifyData(request));
    const { walletId, name, assurance } = request;
    const unit = 0;

    const walletMeta = {
      cwName: name,
      cwAssurance: assurance,
      cwUnit: unit,
    };

    try {
      const wallet: LuxWallet = await updateLuxWallet({ ca, walletId, walletMeta });
      Logger.debug('LuxApi::updateWallet success: ' + stringifyData(wallet));
      return _createWalletFromServerData(wallet);
    } catch (error) {
      Logger.error('LuxApi::updateWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async updateWalletPassword(
    request: UpdateWalletPasswordRequest
  ): Promise<UpdateWalletPasswordResponse> {
    Logger.debug('LuxApi::updateWalletPassword called');
    const { walletId, oldPassword, newPassword } = request;
    try {
      await changeLuxWalletPassphrase({ ca, walletId, oldPassword, newPassword });
      Logger.debug('LuxApi::updateWalletPassword success');
      return true;
    } catch (error) {
      Logger.error('LuxApi::updateWalletPassword error: ' + stringifyError(error));
      if (error.message.includes('Invalid old passphrase given')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  async exportWalletToFile(
    request: ExportWalletToFileRequest
  ): Promise<ExportWalletToFileResponse> {
    const { walletId, filePath } = request;
    Logger.debug('LuxApi::exportWalletToFile called');
    try {
      const response: Promise<[]> = await exportLuxBackupJSON({ ca, walletId, filePath });
      Logger.debug('LuxApi::exportWalletToFile success: ' + stringifyData(response));
      return response;
    } catch (error) {
      Logger.error('LuxApi::exportWalletToFile error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async testReset(): Promise<void> {
    Logger.debug('LuxApi::testReset called');
    try {
      const response: Promise<void> = await luxTestReset({ ca });
      Logger.debug('LuxApi::testReset success: ' + stringifyData(response));
      return response;
    } catch (error) {
      Logger.error('LuxApi::testReset error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }
}

// ========== TRANSFORM SERVER DATA INTO FRONTEND MODELS =========

const _createWalletFromServerData = action(
  'LuxApi::_createWalletFromServerData', (data: LuxWallet) => (
    new Wallet({
      id: data.cwId,
      amount: new BigNumber(data.cwAmount.getCCoin).dividedBy(LOVELACES_PER_LUX),
      name: data.cwMeta.cwName,
      assurance: data.cwMeta.cwAssurance,
      hasPassword: data.cwHasPassphrase,
      passwordUpdateDate: unixTimestampToDate(data.cwPassphraseLU),
    })
  )
);

const _createAddressFromServerData = action(
  'LuxApi::_createAddressFromServerData', (data: LuxAddress) => (
    new WalletAddress({
      id: data.cadId,
      amount: new BigNumber(data.cadAmount.getCCoin).dividedBy(LOVELACES_PER_LUX),
      isUsed: data.cadIsUsed,
    })
  )
);

const _conditionToTxState = (condition: string) => {
  switch (condition) {
    case 'CPtxApplying': return 'pending';
    case 'CPtxWontApply': return 'failed';
    default: return 'ok'; // CPtxInBlocks && CPtxNotTracked
  }
};

const _createTransactionFromServerData = action(
  'LuxApi::_createTransactionFromServerData', (data: LuxTransaction) => {
    const coins = data.ctAmount.getCCoin;
    const { ctmTitle, ctmDescription, ctmDate } = data.ctMeta;
    return new WalletTransaction({
      id: data.ctId,
      title: ctmTitle || data.ctIsOutgoing ? 'Lux sent' : 'Lux received',
      type: data.ctIsOutgoing ? transactionTypes.EXPEND : transactionTypes.INCOME,
      amount: new BigNumber(data.ctIsOutgoing ? -1 * coins : coins).dividedBy(LOVELACES_PER_LUX),
      date: unixTimestampToDate(ctmDate),
      description: ctmDescription || '',
      numberOfConfirmations: data.ctConfirmations,
      addresses: {
        from: data.ctInputs.map(address => address[0]),
        to: data.ctOutputs.map(address => address[0]),
      },
      state: _conditionToTxState(data.ctCondition),
    });
  }
);

const _createTransactionFeeFromServerData = action(
  'LuxApi::_createTransactionFeeFromServerData', (data: LuxTransactionFee) => {
    const coins = data.getCCoin;
    return new BigNumber(coins).dividedBy(LOVELACES_PER_LUX);
  }
);
