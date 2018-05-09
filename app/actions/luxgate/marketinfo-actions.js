// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class MarketInfoActions {
  getLGOrders: Action<{ coin: string, address: string }> = new Action();
  getLGTransactions: Action<{ coin: string, address: string }> = new Action();
  getLGPriceArray: Action<{ coin1: string, coin2: string }> = new Action();
  getLGTradeArray: Action<{ coin1: string, coin2: string }> = new Action();
}
