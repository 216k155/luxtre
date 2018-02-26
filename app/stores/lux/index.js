// @flow
import { observable, action } from 'mobx';
import LuxWalletsStore from './LuxWalletsStore';
import LuxWalletSettingsStore from './LuxWalletSettingsStore';
import LuxTransactionsStore from './LuxTransactionsStore';

export const luxStoreClasses = {
  wallets: LuxWalletsStore,
  walletSettings: LuxWalletSettingsStore,
  transactions: LuxTransactionsStore,
};

export type LuxStoresMap = {
  wallets: LuxWalletsStore,
  walletSettings: LuxWalletSettingsStore,
  transactions: LuxTransactionsStore,
};

const luxStores = observable({
  wallets: null,
  walletSettings: null,
  transactions: null,
});

// Set up and return the stores and reset all stores to defaults
export default action((stores, api, actions): LuxStoresMap => {
  const storeNames = Object.keys(luxStoreClasses);
  storeNames.forEach(name => { if (luxStores[name]) luxStores[name].teardown(); });
  storeNames.forEach(name => {
    luxStores[name] = new luxStoreClasses[name](stores, api, actions);
  });
  storeNames.forEach(name => { if (luxStores[name]) luxStores[name].initialize(); });
  return luxStores;
});
