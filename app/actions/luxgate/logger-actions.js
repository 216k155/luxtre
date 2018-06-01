// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class LoggerActions {
  addLog: Action<{ content: string, alarm: boolean }> = new Action();
}
