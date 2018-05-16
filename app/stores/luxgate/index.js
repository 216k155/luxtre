// @flow
import { observable, action } from 'mobx';
import LuxgateLoginInfoStore from './LuxgateLoginInfoStore';
import LuxgateCoinInfoStore from './LuxgateCoinInfoStore';
import LuxgateMarketInfoStore from './LuxgateMarketInfoStore';

export const luxgateStoreClasses = {
  loginInfo: LuxgateLoginInfoStore,
  coinInfo: LuxgateCoinInfoStore,
  marketInfo: LuxgateMarketInfoStore,
};

export type LuxgateStoresMap = {
  loginInfo: LuxgateLoginInfoStore,
  coinInfo: LuxgateCoinInfoStore,
  marketInfo: LuxgateMarketInfoStore,
};

const luxgateStores = observable({
  loginInfo: null,
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
