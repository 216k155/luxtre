// @flow
import { observable, action } from 'mobx';
import LuxgateCoinInfoStore from './LuxgateCoinInfoStore';
import LuxgateOrdersStore from './LuxgateOrdersStore';
import LuxgateTransactionsStore from './LuxgateTransactionsStore';

export const luxgateStoreClasses = {
  coinInfo: LuxgateCoinInfoStore,
  orders: LuxgateOrdersStore,
  transactions: LuxgateTransactionsStore
};

export type LuxgateStoresMap = {
  coinInfo: LuxgateCoinInfoStore,
  orders: LuxgateOrdersStore,
  transactions: LuxgateTransactionsStore
};

const luxgateStores = observable({
  coinInfo: null,
  orders: null,
  transactions: null
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
