// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import LGOrders from '../../domain/LGOrders';
import LGPriceArray from '../../domain/LGPriceArray';
import Request from '.././lib/LocalizedRequest';

import type {
  GetLGOrdersResponse,
  GetLGTradeArrayResponse,
  GetCoinPriceResponse,
  GetLGPriceArrayResponse
} from '../../api/common';

import type { LGPrice } from '../../domain/LGPriceArray';

export default class LuxgateMarketInfoStore extends Store {
  LGORDERS_REFRESH_INTERVAL = 10000;
  LGPRICEARRAY_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable
  getLGOrdersRequest: Request<GetLGOrdersResponse> = new Request(this.api.luxgate.getLGOrders);
  @observable
  getCoinPriceRequest: Request<GetCoinPriceResponse> = new Request(this.api.luxgate.getCoinPrice);
  @observable
  getLGPriceArrayRequest: Request<GetLGPriceArrayResponse> = new Request(
    this.api.luxgate.getLGPriceArray
  );

  @observable LGOrdersData: Array<LGOrders> = [];
  @observable lstLGTransactions: Array<LGTransactions> = [];
  @observable lstLGTradeArray: Array<LGTradeArray> = [];
  @observable lstLGPriceArray: Array<LGPrice> = [];
  @observable coinPrice: number = 0;

  setup() {
    super.setup();

    // TODO: Uncomment out polling actions
    // setInterval(this._pollRefresh, this.LGORDERS_REFRESH_INTERVAL);
    // setInterval(this._pollRefresh, this.LGPRICEARRAY_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { marketInfo } = luxgate;
    // TODO: Uncomment out listeners
    //  marketInfo.getLGOrders.listen(this._getLGOrders);
    //  marketInfo.getLGPriceArray.listen(this._getLGPriceArray);
  }

  @action
  refreshLGOrdersData = async () => {
    if (this.stores.networkStatus.isConnected && this.stores.networkStatus.isSynced) {
      const password = this.stores.luxgate.loginInfo.password;
      if (password == '') return;

      const swap_coin1 = this.stores.luxgate.coinInfo.swap_coin1;
      const swap_coin2 = this.stores.luxgate.coinInfo.swap_coin2;
      if (swap_coin1 != '' && swap_coin2 != '') {
        const info: GetLGOrdersResponse = await this.getLGOrdersRequest.execute(
          password,
          swap_coin1,
          swap_coin2
        ).promise;
        if (info !== '') {
          this.replaceOrderData(info);
        }

        this.getLGOrdersRequest.reset();
      }
    }
  };

  @action
  refreshLGPriceArrayData = async () => {
    if (this.stores.networkStatus.isConnected && this.stores.networkStatus.isSynced) {
      const password = this.stores.luxgate.loginInfo.password;
      if (password == '') return;

      const swap_coin1 = this.stores.luxgate.coinInfo.swap_coin1;
      const swap_coin2 = this.stores.luxgate.coinInfo.swap_coin2;

      if (swap_coin1 != '' && swap_coin2 !== '') {
        const info: GetLGPriceArrayResponse = await this.getLGPriceArrayRequest.execute(
          password,
          swap_coin1, // base revs / revenue?
          swap_coin2, // rel
          120 // timescale 120?
        ).promise;
        if (info !== '') {
          const objInfo = JSON.parse(info);
          // Assumption response comes in a string so convert to { prices: Array<LGPrice> }
          // objInfo = [[timestamp, high, low, open, close, relvolume, basevolume, aveprice, numtrades], ...]
          const prices = objInfo.map(priceArray => ({
            timestamp: priceArray[0],
            high: priceArray[1],
            low: priceArray[2],
            open: priceArray[3],
            close: priceArray[4],
            relvolume: priceArray[5],
            basevolume: priceArray[6],
            numtrades: priceArray[7]
          }));
          this._addLGPriceArray(new LGPriceArray({ prices }));
        }

        this.getLGPriceArrayRequest.reset();
      }
    }
  };

  @action
  replaceOrderData(info) {
    this.LGOrdersData.bids = info.bids;
    this.LGOrdersData.numbids = info.numbids;
    this.LGOrdersData.asks = info.asks;
    this.LGOrdersData.numasks = info.numasks;
  }

  @computed
  get ordersData(): LGOrders {
    return this.LGOrdersData;
  }

  _pollRefresh = async () => {
    if (!this.stores.sidebar.isShowingLuxtre) {
      await this.refreshCoinPrice();
      await this.refreshLGOrdersData();
      await this.refreshLGPriceArrayData();
    }
  };

  // ////////////////////////////////////////////////////////////
  /* ------------------- Transactions ----------------------- */

  @action
  _addLGTransactions = (info: LGTransactions) => {
    for (let i = 0; i < this.lstLGTransactions.length; i++) {
      if (this.lstLGTransactions[i].coin === info.coin) {
        this.lstLGTransactions[i] = info;
        return;
      }
    }
    this.lstLGTransactions.push(info);
  };

  @action
  _removeLGTransactions = (index: number) => {
    this.lstLGTransactions.splice(index, 1);
  };

  @computed
  get lgTransactionsList(): Array<LGTransactions> {
    return this.lstLGTransactions;
  }

  // ////////////////////////////////////////////////////////////
  /* ------------------- TradeArray ----------------------- */

  @action
  _addLGTradeArray = (info: LGTradeArray) => {
    for (let i = 0; i < this.lstLGTradeArray.length; i++) {
      if (this.lstLGTradeArray[i].coin === info.coin) {
        this.lstLGTradeArray[i] = info;
        return;
      }
    }
    this.lstLGTradeArray.push(info);
  };

  @action
  _removeLGTradeArray = (index: number) => {
    this.lstLGTradeArray.splice(index, 1);
  };

  @computed
  get lgTradeArrayList(): Array<LGTradeArray> {
    return this.lstLGTradeArray;
  }

  // ////////////////////////////////////////////////////////////
  /* ------------------- PriceArray ----------------------- */

  @action
  _addLGPriceArray = (info: LGPriceArray) => {
    for (let i = 0; i < this.lstLGPriceArray.length; i++) {
      if (this.lstLGPriceArray[i] === info.prices[i]) {
        this.lstLGPriceArray[i] = info.prices[i];
        return;
      }
    }
    this.lstLGPriceArray.concat(info.prices);
  };

  @action
  _removeLGPriceArray = (index: number) => {
    this.lstLGPriceArray.splice(index, 1);
  };

  @computed
  get lgPriceArrayList(): Array<LGPrice> {
    return this.lstLGPriceArray;
  }

  @action
  refreshCoinPrice = async () => {
    const password = this.stores.luxgate.loginInfo.password;
    if (password == '') return 0;

    const coin1 = this.stores.luxgate.coinInfo.swap_coin1;
    const coin2 = this.stores.luxgate.coinInfo.swap_coin2;

    if (coin1 == coin2) return 0;

    const price: GetCoinPriceResponse = await this.getCoinPriceRequest.execute(
      password,
      coin1,
      coin2
    ).promise;
    this.setCoinPrice(price);
  };

  @action
  setCoinPrice(price) {
    this.coinPrice = price;
  }
}
