// @flow
import WalletsActions from './wallets-actions';
import WalletSettingsActions from './wallet-settings-actions';

export type LuxActionsMap = {
  wallets: WalletsActions,
  walletSettings: WalletSettingsActions,
};

const luxActionsMap: LuxActionsMap = {
  wallets: new WalletsActions(),
  walletSettings: new WalletSettingsActions(),
};

export default luxActionsMap;
