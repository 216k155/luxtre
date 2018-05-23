// @flow
import RouterActions from './router-actions';
import SidebarActions from './sidebar-actions';
import WindowActions from './window-actions';
import NetworkStatusActions from './network-status-actions';
import WalletBackupActions from './wallet-backup-actions';
import ProfileActions from './profile-actions';
import DialogsActions from './dialogs-actions';
import NotificationsActions from './notifications-actions';
import luxActionsMap from './lux/index';
import luxgateActionsMap from './luxgate/index';
import type { LuxActionsMap } from './lux/index';
import type { LuxgateActionsMap } from './luxgate/index';

export type ActionsMap = {
  router: RouterActions,
  sidebar: SidebarActions,
  window: WindowActions,
  networkStatus: NetworkStatusActions,
  walletBackup: WalletBackupActions,
  profile: ProfileActions,
  dialogs: DialogsActions,
  notifications: NotificationsActions,
  lux: LuxActionsMap,
  luxgate: LuxgateActionsMap
};

const actionsMap: ActionsMap = {
  router: new RouterActions(),
  sidebar: new SidebarActions(),
  window: new WindowActions(),
  networkStatus: new NetworkStatusActions(),
  walletBackup: new WalletBackupActions(),
  profile: new ProfileActions(),
  dialogs: new DialogsActions(),
  notifications: new NotificationsActions(),
  lux: luxActionsMap,
  luxgate: luxgateActionsMap
};

export default actionsMap;
