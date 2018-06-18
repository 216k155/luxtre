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

// ========= Response Types =========
export type LuxAssurance = 'CWANormal' | 'CWAStrict';
export type LuxTransactionCondition = 'CPtxApplying' | 'CPtxInBlocks' | 'CPtxWontApply' | 'CPtxNotTracked';
export type LuxWalletRecoveryPhraseResponse = Array<string>;

export type LuxSyncProgressResponse = {
  _spLocalCD: {
    getChainDifficulty: {
      getBlockCount: number,
    }
  },
  _spNetworkCD: {
    getChainDifficulty: {
      getBlockCount: number,
    }
  },
  _spPeers: number,
};

export type LuxWalletInitData = {
  cwInitMeta: {
    cwName: string,
    cwAssurance: LuxAssurance,
    cwUnit: number,
  },
  cwBackupPhrase: {
    bpToList: [],
  }
};

export type LuxBlock = {
  time: number
};

export type LuxSyncProgress = ?{
  startingBlock: LuxBlock,
  currentBlock: LuxBlock,
  highestBlock: LuxBlock
};

export type LuxAmount = {
  getCCoin: number,
};
export type LuxTransactionTag = 'CTIn' | 'CTOut';

export type LuxTransaction = {
  account: string,
  address: LuxWalletId,
  category: string,
  amount: BigNumber,
  fee: BigNumber,
  vout?: BigNumber,
  confirmations: number,
  bcconfirmations: number,
  txid: LuxTxHash,
  // nonce: string,
  blockhash: string,
  // blockNumber: LuxBlockNumber,
  blockindex: string,
  blocktime: number,
  time: number,
  generated: boolean
  // value: string,
  // gasPrice: LuxGasPrice,
  // gas: LuxGas,
  // input: string,
};

export type LuxTransactions = [
  Array<LuxTransaction>,
  number,
];

export type LuxTransactionInputOutput = [
  [string, LuxAmount],
];

export type LuxTransactionFee = LuxAmount;

export type LuxWallet = {
  cwAccountsNumber: number,
  cwAmount: LuxAmount,
  cwHasPassphrase: boolean,
  cwId: string,
  cwMeta: {
    cwAssurance: LuxAssurance,
    cwName: string,
    csUnit: number,
  },
  cwPassphraseLU: Date,
};

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

export type LuxWallets = Array<LuxWallet>;

export type LuxPeerInfo = {
  startingheight: number
};

export type LuxPeerInfos = Array<LuxPeerInfo>;

export type LuxContractInfo = {
  txid: string,
  sender: string,
  hash160: string,
  address: string
};

export type SendToLuxContractOutput = {
  txid: string,
  sender: string,
  hash160: string
};

