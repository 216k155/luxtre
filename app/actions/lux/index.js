// @flow
import WalletsActions from './wallets-actions';
import LuxRedemptionActions from './lux-redemption-actions';
import TransactionsActions from './transactions-actions';
import NodeUpdateActions from './node-update-actions';
import WalletSettingsActions from './wallet-settings-actions';
import AddressesActions from './addresses-actions';

export type LuxActionsMap = {
  wallets: WalletsActions,
  luxRedemption: LuxRedemptionActions,
  transactions: TransactionsActions,
  nodeUpdate: NodeUpdateActions,
  walletSettings: WalletSettingsActions,
  addresses: AddressesActions,
};

const luxActionsMap: LuxActionsMap = {
  wallets: new WalletsActions(),
  luxRedemption: new LuxRedemptionActions(),
  transactions: new TransactionsActions(),
  nodeUpdate: new NodeUpdateActions(),
  walletSettings: new WalletSettingsActions(),
  addresses: new AddressesActions(),
};

export default luxActionsMap;
