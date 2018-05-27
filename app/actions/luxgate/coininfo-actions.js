// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class CoinInfoActions {
  getCoinInfo: Action<{ coin: string }> = new Action();
  getCoinBalanace: Action<{ coin: string, address: string }> = new Action();
  getBalanaceFromAddress: Action<{ coin: string }> = new Action();
  sendCoin: Action<{ coin: string, receiver: string, amount: number }> = new Action();
  swapCoin: Action<{ buy_coin: string, sell_coin: string, amount: number, value: number }> = new Action();
}
