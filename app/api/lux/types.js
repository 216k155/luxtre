// @flow
import BigNumber from 'bignumber.js';

export type LuxAccountPassphrase = string;
export type LuxWalletId = string;
export type LuxWalletBalance = BigNumber;
export type LuxBlockNumber = number;
export type LuxGas = string;
export type LuxGasPrice = BigNumber;
export type LuxTxHash = string;
export type LuxAddress = string;

export type LuxRecoveryPassphrase = Array<string>;

export type LuxAddresses = Array<LuxAddress>;
// export type LuxAccounts = Array<LuxWalletId>;
export type LuxAccounts = object;

export type LuxBlock = {
  time: number
};

export type LuxSyncProgress = ?{
  startingBlock: LuxBlock,
  currentBlock: LuxBlock,
  highestBlock: LuxBlock
};

// {
//   "account" : "Main",
//   "address" : "LbMBwLkw3sSB1AVeRdfP1mHcf8Zpgfwgi2",
//   "category" : "receive",
//   "amount" : 300.00000000,
//   "vout" : 3,
//   "confirmations" : 1517,
//   "bcconfirmations" : 1517,
//   "blockhash" : "000000000002926cde088c782abe82b8c9d1699836581eb2e29ceb28994df6d4",
//   "blockindex" : 1,
//   "blocktime" : 1520024670,
//   "txid" : "a6adfb188fac6716480ab68767b0bd99bd061ca14cf861412639849e50c7ccc1",
//   "walletconflicts" : [
//   ],
//   "time" : 1520024670,
//   "timereceived" : 1520122944
// },

export type LuxTransaction = {
  account: string,
  address: LuxWalletId,
  category: string,
  amount: BigNumber,
  fee: BigNumber,
  vout: BigNumber,
  confirmations: number,
  bcconfirmations: number,
  txid: LuxTxHash,
  // nonce: string,
  blockhash: string,
  // blockNumber: LuxBlockNumber,
  blockindex: string,
  blocktime: number
  // value: string,
  // gasPrice: LuxGasPrice,
  // gas: LuxGas,
  // input: string,
};

export type LuxTransactions = Array<LuxTransaction>;

export type LuxInfo = {
  // version: number,
  // protocolversion: number,
  // walletversion: number,
  // balance: BigNumber,
  blocks: number,
  // timeoffset: number,
  // connections: number,
  // proxy: string,
  // difficulty: BigNumber//3007383866429.732,
  // testnet: boolean,
  // keypoololdest: number,
  // keypoolsize: number,
  // unlocked_until: number,
  // paytxfee: BigNumber,
  // relayfee: BigNumber,
  errors: string
};

export type LuxPeerInfo = {
  startingheight: number
};

export type LuxPeerInfos = Array<LuxPeerInfo>;
