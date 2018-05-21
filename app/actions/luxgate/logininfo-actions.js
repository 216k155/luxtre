// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class LoginInfoActions {
  createNewPhrase: Action<any> = new Action();
  loginWithPhrase: Action<{ phrase: string }> = new Action();
  logoutAccount: Action<any> = new Action();
}
