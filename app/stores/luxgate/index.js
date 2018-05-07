// @flow
import { observable, action } from 'mobx';
import LuxgateCoinInfoStore from './LuxgateCoinInfoStore';

export const luxgateStoreClasses = {
  coinInfo: LuxgateCoinInfoStore
};

export type LuxgateStoresMap = {
  coinInfo: LuxgateCoinInfoStore
};

const luxgateStores = observable({
  coinInfo: null
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
