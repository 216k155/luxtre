// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class CoinInfoActions {
  createNewPhrase: Action<any> = new Action();
  loginWithPhrase: Action<any> = new Action();
}
