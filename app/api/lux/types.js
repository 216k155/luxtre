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
//export type LuxAccounts = Array<LuxWalletId>;
export type LuxAccounts = object;

export type LuxBlock = {
  time: number
};

export type LuxSyncProgress = ?{
  startingBlock: LuxBlock,
  currentBlock: LuxBlock,
  highestBlock: LuxBlock
};

export type LuxTransaction = {
  account: string,
  address: LuxWalletId,
  category: string,
  amount: BigNumber,
  fee: BigNumber,
  confirmations: number,
  txid: LuxTxHash,
  //nonce: string,
  blockhash: string,
  //blockNumber: LuxBlockNumber,
  blockindex: string,
  blocktime: numner
  //value: string,
  //gasPrice: LuxGasPrice,
  //gas: LuxGas,
  //input: string,
};

export type LuxTransactions = Array<LuxTransaction>;

export type LuxInfo = {
		//version: number,
		//protocolversion: number,
		//walletversion: number,
		//balance: BigNumber,
		blocks: number,
		//timeoffset: number,
		//connections: number,
		//proxy: string,
		//difficulty: BigNumber//3007383866429.732,
		//testnet: boolean,
		//keypoololdest: number,
		//keypoolsize: number,
		//unlocked_until: number,
		//paytxfee: BigNumber,
		//relayfee: BigNumber,
		errors: string
};

export type LuxPeerInfo = {
  startingheight: number
};

export type LuxPeerInfos = Array<LuxPeerInfo>;