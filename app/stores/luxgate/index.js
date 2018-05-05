// @flow
import { observable, action } from 'mobx';
import LuxgateBalanceStore from './LuxgateBalanceStore';

export const luxgateStoreClasses = {
  balances: LuxgateBalanceStore
};

export type LuxgateStoresMap = {
  balances: LuxgateBalanceStore
};

const luxgateStores = observable({
  balances: null
});

// Set up and return the stores and reset all stores to defaults
export default action((stores, api, actions): LuxgateStoresMap => {
  const storeNames = Object.keys(luxgateStoreClasses);
  storeNames.forEach(name => { if (luxgateStores[name]) luxgateStores[name].teardown(); });
  storeNames.forEach(name => {
    luxgateStores[name] = new luxgateStoreClasses[name](stores, api, actions);
  });
  storeNames.forEach(name => { if (luxgateStores[name]) luxgateStores[name].initialize(); });
  return luxgateStores;
});
