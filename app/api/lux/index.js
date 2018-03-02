// @flow
import CoinKey from 'coinkey';
import BigNumber from 'bignumber.js';
import { remote } from 'electron';
// import { isAddress } from 'web3-utils/src/utils';
import { getLuxInfo } from './getLuxInfo';
import { getLuxPeerInfo } from './getLuxPeerInfo';
import { Logger, stringifyData, stringifyError } from '../../utils/logging';
import {
  GenericApiError,
  IncorrectWalletPasswordError,
  WalletAlreadyRestoredError
} from '../common';
import { mnemonicToSeedHex, quantityToBigNumber, unixTimestampToDate } from './lib/utils';
import {
  getLuxWalletData,
  setLuxWalletData,
  unsetLuxWalletData,
  updateLuxWalletData,
  initLuxWalletsDummyData
} from './luxLocalStorage';
import { LUX_DEFAULT_GAS_PRICE, WEI_PER_LUX } from '../../config/numbersConfig';
import Wallet from '../../domain/Wallet';
import WalletTransaction, {
  transactionStates,
  transactionTypes
} from '../../domain/WalletTransaction';

import { getLuxAccounts } from './getLuxAccounts';
import { getLuxAccountBalance } from './getLuxAccountBalance';
import { getLuxAccountRecoveryPhrase } from './getLuxAccountRecoveryPhrase';
// import { createLuxAccount } from './createLuxAccount';
import { getLuxBlockByHash } from './getLuxBlock';
import { sendLuxTransaction } from './sendLuxTransaction';
import { deleteLuxAccount } from './deleteLuxAccount';
import { getLuxTransactionByHash } from './getLuxTransaction';
import { changeLuxAccountPassphrase } from './changeLuxAccountPassphrase';
import { getLuxEstimatedGas } from './getLuxEstimatedGas';
import { getLuxTransactions } from './getLuxTransactions';
import { getLuxBlockNumber } from './getLuxBlockNumber';
import { getLuxAddressesByAccount } from './getLuxAddressesByAccount';
import { importLuxPrivateKey } from './importLuxPrivateKey';
import { setLuxAccount } from './setLuxAccount';
import { getLuxAccountAddress } from './getLuxAccountAddress';
import { isLuxValidAddress } from './isLuxValidAddress';
import { isValidMnemonic } from '../../../lib/decrypt';

import type { TransactionType } from '../../domain/WalletTransaction';
import type {
  GetSyncProgressResponse,
  GetWalletRecoveryPhraseResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetWalletsResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  UpdateWalletResponse,
  UpdateWalletPasswordRequest,
  UpdateWalletPasswordResponse,
  DeleteWalletRequest,
  DeleteWalletResponse,
  RestoreWalletRequest,
  RestoreWalletResponse,
  CreateTransactionResponse
} from '../common';

import type {
  LuxSyncProgress,
  LuxAccounts,
  LuxWalletBalance,
  LuxTransactions,
  LuxBlockNumber,
  LuxWalletId,
  LuxRecoveryPassphrase,
  LuxTxHash,
  LuxGas,
  LuxBlock,
  LuxTransaction,
  LuxAddresses
} from './types';

// Load Dummy LUX Wallets into Local Storage
(async () => {
  await initLuxWalletsDummyData();
})();

/**
 * The LUX api layer that handles all requests to the
 * mantis client which is used as backend for LUX blockchain.
 */

const ca = remote.getGlobal('ca');

// export const LUX_API_HOST = 'ec2-52-30-28-57.eu-west-1.compute.amazonaws.com';
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

export type GetEstimatedGasPriceRequest = {
  ca: string,
  from: string,
  to: string,
  value: BigNumber,
  gasPrice: BigNumber
};
export type GetEstimatedGasPriceResponse = Promise<BigNumber>;

export default class LuxApi {
  async getSyncProgress(): Promise<GetSyncProgressResponse> {
    Logger.debug('LuxApi::getSyncProgress called');
    try {
      const response: LuxInfo = await getLuxInfo();
      // Logger.info('LuxApi::getLuxInfo success: ' + stringifyData(response));
      const peerInfos: LuxPeerInfos = await getLuxPeerInfo();
      // Logger.info('LuxApi::getLuxPeerInfo success: ' + stringifyData(peerInfos));
      const totalBlocks = peerInfos.sort((a, b) => b.startingheight - a.startingheight)[0]
        .startingheight;

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
      delete accounts[''];
      // Logger.error('LuxApi::getWallets success: ' + stringifyData(accounts));
      return await Promise.all(
        Object.keys(accounts).map(async id => {
          // const amount = quantityToBigNumber(accounts[id]);
          let amount = await this.getAccountBalance(id);
          amount = quantityToBigNumber(amount);
          const walletId = id;
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
              hasPassword: true,
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
      const confirmations = 1;
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
      const walletId = request.walletId;
      const mostRecentBlockNumber: LuxBlockNumber = await getLuxBlockNumber();
      const transactions: LuxTransactions = await getLuxTransactions({
        walletId,
        fromBlock: Math.max(mostRecentBlockNumber - 10000, 0),
        toBlock: mostRecentBlockNumber
      });
      console.log(transactions);
      Logger.debug('LuxApi::getTransactions success: ' + stringifyData(transactions));
      const allTxs = await Promise.all(
        transactions.map(async (tx: LuxTransaction) => {
          if (tx.category == 'receive') {
            return _createWalletTransactionFromServerData(transactionTypes.INCOME, tx);
          }

          if (tx.category == 'send') {
            return _createWalletTransactionFromServerData(transactionTypes.EXPEND, tx);
          }
        })
      );
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
      const oldAddresses: LuxAddresses = await getLuxAddressesByAccount({ account });
      const label = '';
      const rescan = false;
      await importLuxPrivateKey({ privateKey, label, rescan });
      const newAddresses: LuxAddresses = await getLuxAddressesByAccount({ account });
      Logger.debug('LuxApi::getLuxAddressesByAccount success: ' + name);

      let newAddress = null;
      if (newAddresses.length - oldAddresses.length == 1) {
        newAddresses.forEach(async (currUnAssAdd, indexUnAssAdd, arrUnAssAdd) => {
          const newUnAssAdd = oldAddresses.find(
            (currUnAssAddOld, indexUnAssAddOld, arrUnAssAddOld) => currUnAssAddOld === currUnAssAdd
          );
          if (!newUnAssAdd) {
            newAddress = newAddresses[indexUnAssAdd];
          }
        });
      }

      if (newAddress) {
        const address = newAddress;
        await setLuxAccount({ address, name });
        Logger.debug('LuxApi::importWallet success');
        const id = name;
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
      const response: Promise<LuxRecoveryPassphrase> = new Promise(resolve =>
        resolve(getLuxAccountRecoveryPhrase())
      );
      Logger.debug('LuxApi::getWalletRecoveryPhrase success');
      return response;
    } catch (error) {
      Logger.error('LuxApi::getWalletRecoveryPhrase error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  async createTransaction(params: CreateTransactionRequest): CreateTransactionResponse {
    Logger.debug('LuxApi::createTransaction called');
    try {
      const senderAccount = params.from;
      const { from, to, value, password } = params;
      const txHash: LuxTxHash = await sendLuxTransaction({
        from,
        to,
        value
      });
      Logger.debug('LuxApi::createTransaction success: ' + stringifyData(txHash));
      return _createTransaction(senderAccount, txHash);
    } catch (error) {
      Logger.error('LuxApi::createTransaction error: ' + stringifyError(error));
      if (error.message.includes('Could not decrypt key with given passphrase')) {
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

  async deleteWallet(request: DeleteWalletRequest): Promise<DeleteWalletResponse> {
    Logger.debug('LuxApi::deleteWallet called: ' + stringifyData(request));
    const { walletId } = request;
    try {
      await deleteLuxAccount({ ca, walletId });
      Logger.debug('LuxApi::deleteWallet success: ' + stringifyData(request));
      await unsetLuxWalletData(walletId); // remove wallet data from local storage
      return true;
    } catch (error) {
      Logger.error('LuxApi::deleteWallet error: ' + stringifyError(error));
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

  isValidMnemonic(mnemonic: string): Promise<boolean> {
    return isValidMnemonic(mnemonic, 12);
  }

  isValidAddress(address: string): Promise<boolean> {
    return Promise.resolve(isLuxValidAddress({ address }));
  }

  async getEstimatedGasPriceResponse(
    request: GetEstimatedGasPriceRequest
  ): GetEstimatedGasPriceResponse {
    Logger.debug('LuxApi::getEstimatedGasPriceResponse called');
    try {
      const { from, to, value, gasPrice } = request;
      const estimatedGas: LuxGas = await getLuxEstimatedGas({
        ca,
        from,
        to,
        value,
        gasPrice
      });
      Logger.debug('LuxApi::getEstimatedGasPriceResponse success: ' + stringifyData(estimatedGas));
      return quantityToBigNumber(estimatedGas)
        .times(request.gasPrice)
        .dividedBy(WEI_PER_LUX);
    } catch (error) {
      Logger.error('LuxApi::getEstimatedGasPriceResponse error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  }

  testReset = async (): Promise<boolean> => {
    Logger.debug('LuxApi::testReset called');
    try {
      const accounts: LuxAccounts = await getLuxAccounts({ ca });
      await Promise.all(accounts.map(async id => this.deleteWallet({ walletId: id })));
      Logger.debug('LuxApi::testReset success');
      return true;
    } catch (error) {
      Logger.error('LuxApi::testReset error: ' + stringifyError(error));
      throw new GenericApiError();
    }
  };
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
  const blockDate = unixTimestampToDate(blocktime);
  return new WalletTransaction({
    id: txid,
    type,
    title: '',
    description: '',
    amount: quantityToBigNumber(amount),
    date: blockDate,
    numberOfConfirmations: confirmations,
    address,
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
