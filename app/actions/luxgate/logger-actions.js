// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class LoggerActions {
  addLog: Action<{ log: string }> = new Action();
}
