// @flow
export const ROUTES = {
  ROOT: '/',
  STAKING: '/staking',
  LUX_REDEMPTION: '/lux-redemption',
  NO_WALLETS: '/no-wallets',
  PROFILE: {
    LANGUAGE_SELECTION: '/profile/language-selection',
    TERMS_OF_USE: '/profile/terms-of-use',
    SEND_LOGS: '/profile/send-logs-choice',
  },
  WALLETS: {
    ROOT: '/wallets',
    PAGE: '/wallets/:id/:page',
    SUMMARY: '/wallets/:id/summary',
    TRANSACTIONS: '/wallets/:id/transactions',
    SEND: '/wallets/:id/send',
    RECEIVE: '/wallets/:id/receive',
    SETTINGS: '/wallets/:id/settings',
    UTILITIES: {
      ROOT: '/wallets/:id/utilities',
      PAGE: '/wallets/:id/utilities/:page',
      POSCALCULATOR: '/wallets/:id/utilities/poscalculator',
    },
    MASTERNODES: {
      ROOT: '/wallets/:id/masternodes',
      PAGE: '/wallets/:id/masternodes/:page',
      MASTERNODESNET: '/wallets/:id/masternodes/masternodesnet',
      MYMASTERNODE: '/wallets/:id/masternodes/mymasternode',
    }
    //MASTERNODESNET: '/wallets/:id/masternodesnet',
    //MYMASTERNODE: '/wallets/:id/mymasternode',
  },
  
  SETTINGS: {
    ROOT: '/settings',
    GENERAL: '/settings/general',
    TERMS_OF_USE: '/settings/terms-of-use',
    SUPPORT: '/settings/support',
    DISPLAY: '/settings/display',
  },
};
