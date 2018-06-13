// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class SettingInfoActions {
  saveSettings: Action<{ settings: Array }> = new Action();
}
