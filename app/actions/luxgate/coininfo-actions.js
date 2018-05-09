// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class CoinInfoActions {
  getCoinInfo: Action<{ coin: string }> = new Action();
  getCoinBalanace: Action<{ coin: string, address: string }> = new Action();
  getLGOrders: Action<{ coin: string, address: string }> = new Action();
  getLGTransactions: Action<{ coin: string, address: string }> = new Action();
  getBalanaceFromAddress: Action<{ coin: string }> = new Action();
}
