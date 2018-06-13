// @flow
import Action from './lib/Action';

// ======= SIDEBAR ACTIONS =======

export default class SidebarActions {
  switchLuxgate: Action<any> = new Action();
  activateCategory: Action<{ category: string, showSubMenu?: boolean }> = new Action();
  walletSelected: Action<{ walletId: string }> = new Action();
}
