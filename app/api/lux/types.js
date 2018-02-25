// @flow
import BigNumber from 'bignumber.js';

export type LuxAccountPassphrase = string;
export type LuxWalletId = string;
export type LuxWalletBalance = string;
export type LuxBlockNumber = number;
export type LuxGas = string;
export type LuxGasPrice = BigNumber;
export type LuxTxHash = string;

export type LuxRecoveryPassphrase = Array<string>;

export type LuxAccounts = Array<LuxWalletId>;

export type LuxBlock = {
  timestamp: string
};

export type LuxSyncProgress = ?{
  startingBlock: LuxBlock,
  currentBlock: LuxBlock,
  highestBlock: LuxBlock
};

export type LuxTransaction = {
  hash: LuxTxHash,
  nonce: string,
  blockHash: string,
  blockNumber: LuxBlockNumber,
  transactionIndex: string,
  from: LuxWalletId,
  to: LuxWalletId,
  value: string,
  gasPrice: LuxGasPrice,
  gas: LuxGas,
  input: string,
  pending: boolean,
};

export type LuxTransactions = {
  received: Array<LuxTransaction>,
  sent: Array<LuxTransaction>,
};
