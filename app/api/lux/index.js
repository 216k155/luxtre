// @flow
import { split, get } from 'lodash';
import { action } from 'mobx';
import environment from '../../environment';
import patchLuxApi from './mocks/patchLuxApi';
import CoinKey from 'coinkey';
import BigNumber from 'bignumber.js';
import { ipcRenderer, remote } from 'electron';
import { getLuxInfo } from './getLuxInfo';
import { getLuxPeerInfo } from './getLuxPeerInfo';
import { LOVELACES_PER_LUX } from '../../config/numbersConfig';
import Wallet from '../../domain/Wallet';

import { getLuxAccounts } from './getLuxAccounts';
import { getLuxAccountBalance } from './getLuxAccountBalance';
import { getLuxAccountRecoveryPhrase } from './getLuxAccountRecoveryPhrase';
import { sendLuxTransaction } from './sendLuxTransaction';
import { getLuxTransactionByHash } from './getLuxTransaction';
import { unlockLuxWallet } from './unlockLuxWallet';
import { changeLuxWalletPassphrase } from './changeLuxWalletPassphrase';
import { getLuxTransactions } from './getLuxTransactions';
import { getLuxBlockNumber } from './getLuxBlockNumber';
import { getLuxAddressesByAccount } from './getLuxAddressesByAccount';
import { importLuxPrivateKey } from './importLuxPrivateKey';
import { setLuxAccount } from './setLuxAccount';
import { getLuxAccountAddress } from './getLuxAccountAddress';
import { isValidLuxAddress } from './isValidLuxAddress';
import { isValidMnemonic } from '../../../lib/decrypt';
import WalletAddress from '../../domain/WalletAddress';
import { newLuxWallet } from './newLuxWallet';
import { getLuxNewAddress } from './getLuxNewAddress';
import { restoreLuxWallet } from './restoreLuxWallet';
import { updateLuxWallet } from './updateLuxWallet';
import { exportLuxBackupJSON } from './exportLuxBackupJSON';
import { importLuxBackupJSON } from './importLuxBackupJSON';
import { importLuxWallet } from './importLuxWallet';
import { getLuxWalletAccounts } from './getLuxWalletAccounts';
import { luxTxFee } from './luxTxFee';
import {getLuxUnspentTransactions} from './getLuxUnspentTransactions';
import {getLuxEstimatedFee} from './getLuxEstimatedFee';
import {encryptLuxWallet} from './encryptLuxWallet';

//import { isValidRedemptionKey, isValidPaperVendRedemptionKey } from '../../../lib/redemption-key-validation';
//import { renameLuxWallet } from './renameLuxWallet';
//import { newLuxPayment } from './newLuxPayment';
//import { redeemLux } from './redeemLux';
//import { redeemLuxPaperVend } from './redeemLuxPaperVend';
//import { nextLuxUpdate } from './nextLuxUpdate';
//import { postponeLuxUpdate } from './postponeLuxUpdate';
//import { applyLuxUpdate } from './applyLuxUpdate';
//import { luxTestReset } from './luxTestReset';
//import { getLuxHistoryByWallet } from './getLuxHistoryByWallet';

import WalletTransaction, { 
  transactionStates,
  transactionTypes,
  TransactionType 
} from '../../domain/WalletTransaction';

import type {
  LuxSyncProgressResponse,
  LuxAddress,
  LuxAccounts,
  LuxWalletBalance,
  LuxTransaction,
  LuxTransactionFee,
  LuxTransactions,
  LuxBlockNumber,
  LuxRecoveryPassphrase,
  LuxTxHash,
  LuxWalletId,
  LuxWallet,
  LuxWallets,
  LuxWalletRecoveryPhraseResponse,
} from './types';

import { 
  Logger, 
  stringifyData, 
  stringifyError
} from '../../utils/logging';

import type {
  CreateWalletRequest,
  CreateWalletResponse,
  CreateTransactionResponse,
  RenameWalletRequest,
  RenameWalletResponse,
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
  mnemonicToSeedHex, 
  quantityToBigNumber, 
  unixTimestampToDate 
} from './lib/utils';

import {
  getLuxWalletData,
  setLuxWalletData,
  unsetLuxWalletData,
  updateLuxWalletData,
  initLuxWalletsDummyData
} from './luxLocalStorage';


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

export const LUX_API_HOST = 'localhost';
export const LUX_API_PORT = 9888;
export const LUX_API_USER = 'rpcuser';
export const LUX_API_PWD = 'rpcpwd';

// LUX specific Request / Response params

export type ImportWalletResponse = Wallet;
export type UpdateWalletRequest = Wallet;

export type ImportWalletRequest = {
  name: string,
  privateKey: string,
  password: ?string
};

export type CreateTransactionRequest = {
  from: string,
  to: string,
  value: BigNumber,
  password: string
};

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

/*export type RedeemLuxRequest = {
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
*/

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
//export type PostponeUpdateResponse = Promise<void>;
//export type ApplyUpdateResponse = Promise<void>;

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

export type GetWalletBalanceResponse = Promise<Number>;
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

  async getSyncProgress(): Promise<GetSyncProgressResponse> {
    Logger.debug('LuxApi::getSyncProgress called');
    try {
      const response: LuxInfo = await getLuxInfo();
      //Logger.info('LuxApi::getLuxInfo success: ' + stringifyData(response));
      const peerInfos: LuxPeerInfos = await getLuxPeerInfo();
      //Logger.info('LuxApi::getLuxPeerInfo success: ' + stringifyData(peerInfos));
      var totalBlocks = peerInfos.sort(function(a, b){
        return b.startingheight - a.startingheight;
      })[0].startingheight;

      return {
        localDifficulty: response ? response.blocks : 100,
        networkDifficulty: peerInfos ? totalBlocks : 100
      };
    } catch (error) {
      Logger.error('LuxApi::getSyncProgress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }
  
  getWallets = async (): Promise<GetWalletsResponse> => {
    Logger.debug('LuxApi::getWallets called');
    try {
      const accounts: LuxAccounts = await getLuxAccounts();
      accounts['Main'] = accounts[''];
      delete accounts[''];
      // Logger.error('LuxApi::getWallets success: ' + stringifyData(accounts));
      return await Promise.all(
        Object.keys(accounts).map(async id => {
          //let amount = await this.getAccountBalance(id);
          let amount = await this.getAccountBalance('');//default account
          amount = quantityToBigNumber(amount);
          //const walletId = id;
          const walletId = '';
          const address = await getLuxAccountAddress({ walletId });
          try {
            // use wallet data from local storage
            const walletData = await getLuxWalletData(id); // fetch wallet data from local storage
            const { name, assurance, hasPassword, passwordUpdateDate } = walletData;
            return new Wallet({
              id,
              address,
              name,
              amount,
              assurance,
              hasPassword,
              passwordUpdateDate
            });
          } catch (error) {
            // there is no wallet data in local storage - use fallback data
            const fallbackWalletData = {
              id,
              address,
              name: 'Main',
              assurance: 'CWANormal',
              hasPassword: false,
              passwordUpdateDate: new Date()
            };
            const { name, assurance, hasPassword, passwordUpdateDate } = fallbackWalletData;
            return new Wallet({
              id,
              address,
              name,
              amount,
              assurance,
              hasPassword,
              passwordUpdateDate
            });
          }
        })
      );
    } catch (error) {
      Logger.error('LuxApi::getWallets error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  async getAccountBalance(walletId: string): Promise<GetTransactionsResponse> {
    Logger.debug('LuxApi::getAccountBalance called');
    try {
      const confirmations = 0;
      const response: LuxWalletBalance = await getLuxAccountBalance({
        walletId,
        confirmations
      });
      Logger.debug('LuxApi::getAccountBalance success: ' + stringifyData(response));
      return response;
    } catch (error) {
      Logger.error('LuxApi::getAccountBalance error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  getTransactions = async (request: GetTransactionsRequest): Promise<GetTransactionsResponse> => {
    Logger.debug('LuxApi::getTransactions called: ' + stringifyData(request));
    try {
      //const walletId = request.walletId;
      const walletId = '';//default account
      //const mostRecentBlockNumber: LuxBlockNumber = await getLuxBlockNumber();
      let transactions: LuxTransactions = await getLuxTransactions({
        walletId,
        count: 1000,
        skip: 0
      });
      /*const sendTransactions: LuxTransactions = await getLuxTransactions({
        walletId: '',
        fromBlock: Math.max(mostRecentBlockNumber - 10000, 0),
        toBlock: mostRecentBlockNumber
      });*/
      //transactions = transactions.concat(...sendTransactions);
      const allTxs = await Promise.all(
        transactions.filter(async (tx: LuxTransaction) => tx.category != 'move').map(async (tx: LuxTransaction) => {
          if (tx.category === 'receive') {
            return _createWalletTransactionFromServerData(transactionTypes.INCOME, tx);
          }

          if (tx.category === 'send') {
            return _createWalletTransactionFromServerData(transactionTypes.EXPEND, tx);
          }
        })
      );

      allTxs.sort((a,b) => b.date - a.date);
      return {
        transactions: allTxs,
        total: allTxs.length
      };
    } catch (error) {
      Logger.error('LuxApi::getTransactions error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

  async importWallet(request: ImportWalletRequest): Promise<ImportWalletResponse> {
    Logger.debug('LuxApi::importWallet called: ');
    const { name, privateKey, password } = request;
    Logger.debug('LuxApi::importWallet called: ' + privateKey);
    let ImportWallet = null;
    try {
      const account = '';
      const oldAddresses: LuxAddresses = await getLuxAddressesByAccount({account});
      const label = '';
      const rescan = false;
      await importLuxPrivateKey({privateKey, label, rescan});
      const newAddresses: LuxAddresses = await getLuxAddressesByAccount({account});
      Logger.debug('LuxApi::getLuxAddressesByAccount success: ' + name);

      let newAddress = null;
      if(newAddresses.length - oldAddresses.length==1){
        newAddresses.forEach(async function(currUnAssAdd,indexUnAssAdd,arrUnAssAdd){
            var newUnAssAdd=oldAddresses.find(function(currUnAssAddOld,indexUnAssAddOld,arrUnAssAddOld){
                return currUnAssAddOld===currUnAssAdd;
            })
            if(!newUnAssAdd){
              newAddress = newAddresses[indexUnAssAdd];
            }
        })
      }

      if (newAddress) {
        const address = newAddress;
        const walletId = newAddress;
        await setLuxAccount({ address, walletId });
        Logger.debug('LuxApi::importWallet success');
        const id = address;
        const amount = quantityToBigNumber('0');
        const assurance = 'CWANormal';
        const hasPassword = password !== null;
        const passwordUpdateDate = hasPassword ? new Date() : null;
        await setLuxWalletData({
          id,
          name,
          assurance,
          hasPassword,
          passwordUpdateDate
        });
        ImportWallet = new Wallet({
          id,
          address,
          name,
          amount,
          assurance,
          hasPassword,
          passwordUpdateDate
        });
      }

    } catch (error) {
      Logger.error('LuxApi::importWallet error: ' + stringifyError(error));
      throw error; // Error is handled in parent method (e.g. createWallet/restoreWallet)
    }

    return ImportWallet;
  }

  createWallet = async (request: CreateWalletRequest): Promise<CreateWalletResponse> => {
    Logger.debug('LuxApi::createWallet called');
    const { name, mnemonic, password } = request;
    const privateKeyHex = mnemonicToSeedHex(mnemonic);

    // var ck = CoinKey.fromWif('Q1mY6nVLLkV2LyimeMCViXkPZQuPMhMKq8HTMPAiYuSn72dRCP4d')
    // Logger.error('LuxApi::createWallet private: ' + ck.versions.private.toString());
    // Logger.error('LuxApi::createWallet public: ' + ck.versions.public.toString());

    Logger.debug('LuxApi::createWallet success: ' + privateKeyHex);
    const coinkey = new CoinKey(new Buffer(privateKeyHex, 'hex'), { private: 155, public: 27 });
    const privateKey = coinkey.privateWif;
    Logger.debug('LuxApi::createWallet success: ' + privateKey);
    try {
      const response: ImportWalletResponse = await this.importWallet({
        name,
        privateKey,
        password
      });
      Logger.debug('LuxApi::createWallet success: ' + stringifyData(response));
      return response;
    } catch (error) {
      Logger.error('LuxApi::createWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };

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

  async createTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    Logger.debug('LuxApi::createTransaction called');
    try {
      const senderAccount = request.from;
      const { from, to, value, password } = request;
      if(password !== '')
      {
        await unlockLuxWallet({ password, timeout: 20 });
      }
      Logger.debug('LuxApi::createTransaction value : ' + value.toNumber() );
      const txHash: LuxTxHash = await sendLuxTransaction({
        from,
        to,
        value: value.toNumber()
      });
      Logger.debug('LuxApi::createTransaction success: ' + stringifyData(txHash));
      return _createTransaction(senderAccount, txHash);
    } catch (error) {
      console.error(error);
      Logger.error('LuxApi::createTransaction error: ' + stringifyError(error));
      if (error.message.includes('passphrase')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  async updateWallet(request: UpdateWalletRequest): Promise<UpdateWalletResponse> {
    Logger.debug('LuxApi::updateWallet called: ' + stringifyData(request));
    const { id, name, amount, assurance, hasPassword, passwordUpdateDate } = request;
    try {
      await setLuxWalletData({
        id,
        name,
        assurance,
        hasPassword,
        passwordUpdateDate
      });
      Logger.debug('LuxApi::updateWallet success: ' + stringifyData(request));
      return new Wallet({ id, name, amount, assurance, hasPassword, passwordUpdateDate });
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
      await changeLuxAccountPassphrase({
        ca,
        walletId,
        oldPassword,
        newPassword
      });
      Logger.debug('LuxApi::updateWalletPassword success');
      const hasPassword = newPassword !== null;
      const passwordUpdateDate = hasPassword ? new Date() : null;
      await updateLuxWalletData({
        id: walletId,
        hasPassword,
        passwordUpdateDate
      });
      return true;
    } catch (error) {
      Logger.error('LuxApi::updateWalletPassword error: ' + stringifyError(error));
      if (error.message.includes('Could not decrypt key with given passphrase')) {
        throw new IncorrectWalletPasswordError();
      }
      throw new GenericApiError();
    }
  }

  async renameWallet(request: RenameWalletRequest): Promise<RenameWalletResponse> {
    Logger.debug('LuxApi::renameWallet called: ' + stringifyData(request));
    const { walletId } = request;
    try {
      await deleteLuxAccount({ ca, walletId });
      Logger.debug('LuxApi::renameWallet success: ' + stringifyData(request));
      await unsetLuxWalletData(walletId); // remove wallet data from local storage
      return true;
    } catch (error) {
      Logger.error('LuxApi::renameWallet error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  restoreWallet = async (request: RestoreWalletRequest): Promise<RestoreWalletResponse> => {
    Logger.debug('LuxApi::restoreWallet called');
    const { recoveryPhrase: mnemonic, walletName: name, walletPassword: password } = request;
    const privateKey = mnemonicToSeedHex(mnemonic);
    try {
      const wallet: ImportWalletResponse = await this.importWallet({ name, privateKey, password });
      Logger.debug('LuxApi::restoreWallet success: ' + stringifyData(wallet));
      return wallet;
    } catch (error) {
      Logger.error('LuxApi::restoreWallet error: ' + stringifyError(error));
      if (error.message.includes('account already exists')) {
        throw new WalletAlreadyRestoredError();
      }
      throw new GenericApiError();
    }
  };

  async getWalletBalance(walletId: string): Promise<GetWalletBalanceResponse> {
    let balance = [];
    try {
      const account = walletId;
      const addresses: LuxAddresses = await getLuxAddressesByAccount({account});
  
      const minconf = 1;
      const maxconf = 9999999;
      const unspent: LuxTransactions = await getLuxUnspentTransactions({minconf, maxconf});
      Logger.debug('LuxApi::getWalletBalance success: ' + walletId + ' ' + stringifyData(unspent));

      addresses.forEach(function (currAdd, indexAdd, arrayAdd) {
        let sum = 0.0;
        if(unspent.length>0){
            unspent.forEach(function (currTra, indexTra, arrayTra) {
                if (currTra.address == currAdd) {
                    sum += currTra.amount;
                }
                if (indexTra == unspent.length - 1) {
                  balance.push(sum);
                }
            });
        }
      });

    } catch (error)
    {
      Logger.error('LuxApi::getWalletBalance error: ' + stringifyError(error));
      throw error;
    }
    return balance.reduce((a, b) => a + b, 0);
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

  async calculateTransactionFee(request: TransactionFeeRequest): Promise<TransactionFeeResponse> {
    Logger.debug('LuxApi::calculateTransactionFee called');
    const { sender, receiver, amount } = request;
    
    try {
      //const { blocks } = request;
      const blocks = 25;
      const estimatedFee: LuxFee = await getLuxEstimatedFee({
        blocks,
      });
      Logger.debug('LuxApi::getEstimatedResponse success: ' + estimatedFee);
      return quantityToBigNumber(estimatedFee);
    } catch (error) {
      if (error.message.includes('Insufficient funds')) {
        throw new NotEnoughFundsForTransactionFeesError();
      }
      Logger.error('LuxApi::getEstimatedFeeResponse error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async createAddress(request: CreateAddressRequest): Promise<CreateAddressResponse> {
    Logger.debug('LuxApi::createAddress called');
    const { accountId, password } = request;
    try {
      const response: LuxAddress = await getLuxNewAddress(
        { password, accountId }
      );
      Logger.debug('LuxApi::createAddress success: ' + stringifyData(response));
      //return _createAddressFromServerData(response);
      return response;
    } catch (error) {
      Logger.error('LuxApi::createAddress error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  isValidMnemonic(mnemonic: string): Promise<boolean> {
    return isValidMnemonic(mnemonic, 12);
  }

  isValidAddress(address: string): Promise<boolean> {
    return Promise.resolve(isValidLuxAddress({ address }));
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

  async nextUpdate(): Promise<NextUpdateResponse> {
    Logger.debug('LuxApi::nextUpdate called');
    let nextUpdate = null;
    return nextUpdate;
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

const _createWalletTransactionFromServerData = async (
  type: TransactionType,
  txData: LuxTransaction
): Promise<WalletTransaction> => {
  const { txid, blockHash, amount, address, confirmations, blocktime } = txData;
  // const txBlock: ?LuxBlock = blockHash ? await getLuxBlockByHash({
  //  blockHash,
  // }) : null;

  //blocktime isn't returned right after a transaction is sent
  const blockDate = blocktime !== null && blocktime !== undefined ? unixTimestampToDate(blocktime) : unixTimestampToDate(Date.now() / 1000 | 0);
  return new WalletTransaction({
    id: txid,
    type,
    title: '',
    description: '',
    amount: quantityToBigNumber(amount),
    date: blockDate,
    numberOfConfirmations: confirmations,
    address,
    addresses: null,
    state: confirmations < 3 ? transactionStates.PENDING : transactionStates.OK
  });
};

const _createTransaction = async (senderAccount: LuxWalletId, txHash: LuxTxHash) => {
  const txData: LuxTransaction = await getLuxTransactionByHash({
    txHash
  });
  const type = senderAccount === txData.from ? transactionTypes.EXPEND : transactionTypes.INCOME;
  return _createWalletTransactionFromServerData(type, txData);
};

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
