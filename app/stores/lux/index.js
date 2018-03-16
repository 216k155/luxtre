// @flow
import { observable, action } from 'mobx';
import LuxWalletsStore from './LuxWalletsStore';
import TransactionsStore from './LuxTransactionsStore';
import LuxRedemptionStore from './LuxRedemptionStore';
import NodeUpdateStore from './NodeUpdateStore';
import LuxWalletSettingsStore from './LuxWalletSettingsStore';
import AddressesStore from './AddressesStore';
import MasterNodesStore from './LuxMasterNodesStore';

export const luxStoreClasses = {
  wallets: LuxWalletsStore,
  transactions: TransactionsStore,
  luxRedemption: LuxRedemptionStore,
  nodeUpdate: NodeUpdateStore,
  walletSettings: LuxWalletSettingsStore,
  addresses: AddressesStore,
  masternodes: MasterNodesStore
};

export type LuxStoresMap = {
  wallets: LuxWalletsStore,
  transactions: TransactionsStore,
  luxRedemption: LuxRedemptionStore,
  nodeUpdate: NodeUpdateStore,
  walletSettings: LuxWalletSettingsStore,
  addresses: AddressesStore,
  masternodes: MasterNodesStore
};

const luxStores = observable({
  wallets: null,
  transactions: null,
  luxRedemption: null,
  nodeUpdate: null,
  walletSettings: null,
  addresses: null,
  masternodes: null
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
