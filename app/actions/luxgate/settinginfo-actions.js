// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class SettingInfoActions {
  enableCoin: Action<{ phrase: string }> = new Action();
}
