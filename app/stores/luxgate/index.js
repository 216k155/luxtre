// @flow
import { observable, action } from 'mobx';
import LuxgateCoinInfoStore from './LuxgateCoinInfoStore';
import LuxgateMarketInfoStore from './LuxgateMarketInfoStore';

export const luxgateStoreClasses = {
  coinInfo: LuxgateCoinInfoStore,
  marketInfo: LuxgateMarketInfoStore,
};

export type LuxgateStoresMap = {
  coinInfo: LuxgateCoinInfoStore,
  marketInfo: LuxgateMarketInfoStore,
};

const luxgateStores = observable({
  coinInfo: null,
  marketInfo: null,
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
