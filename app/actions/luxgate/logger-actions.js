// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class LoggerActions {
  addLog: Action<{ content: string, type: string }> = new Action();
}
