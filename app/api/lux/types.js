// @flow

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

export type LuxAmount = {
  getCCoin: number,
};
export type LuxTransactionTag = 'CTIn' | 'CTOut';

export type LuxAddress = {
  cadAmount: LuxAmount,
  cadId: string,
  cadIsUsed: boolean,
};

export type LuxAddresses = Array<LuxAddress>;

export type LuxAccount = {
  caAddresses: LuxAddresses,
  caAmount: LuxAmount,
  caId: string,
  caMeta: {
    caName: string,
  },
};

export type LuxAccounts = Array<LuxAccount>;

export type LuxTransaction = {
  ctAmount: LuxAmount,
  ctConfirmations: number,
  ctId: string,
  ctInputs: LuxTransactionInputOutput,
  ctIsOutgoing: boolean,
  ctMeta: {
    ctmDate: Date,
    ctmDescription: ?string,
    ctmTitle: ?string,
  },
  ctOutputs: LuxTransactionInputOutput,
  ctCondition: LuxTransactionCondition,
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

export type LuxWallets = Array<LuxWallet>;
