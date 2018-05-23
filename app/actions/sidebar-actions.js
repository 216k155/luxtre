// @flow
import Action from './lib/Action';

// ======= SIDEBAR ACTIONS =======

export default class SidebarActions {
  toggleSubMenus: Action<any> = new Action();
  switchLuxgate: Action<{ category: string, showSubMenu?: boolean }> = new Action();
  walletSelected: Action<{ walletId: string }> = new Action();
}
