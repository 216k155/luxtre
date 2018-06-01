// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import LGOrders from '../../domain/LGOrders';
//import LGTransactions from '../../domain/LGTransactions';
//import LGTradeArray from '../../domain/LGTradeArray';
//import LGPriceArray from '../../domain/LGPriceArray';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import CachedRequest from '../lib/LocalizedCachedRequest';
import { ROUTES } from '../../routes-config';

import type {
  GetLGOrdersResponse, 
  GetLGTradeArrayResponse,
  GetCoinPriceResponse,
  GetLGPriceArrayResponse
} from '../../api/common';

export default class LuxgateMarketInfoStore extends Store {

  LGORDERS_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getLGOrdersRequest: Request<GetLGOrdersResponse> = new Request(this.api.luxgate.getLGOrders);
  @observable getCoinPriceRequest: Request<GetCoinPriceResponse> = new Request(this.api.luxgate.getCoinPrice);

  @observable LGOrdersData: Array<LGOrders> = [];
  @observable lstLGTransactions: Array<LGTransactions> = [];
  @observable lstLGTradeArray: Array<LGTradeArray> = [];
  @observable lstLGPriceArray: Array<LGPriceArray> = [];
  @observable coinPrice: number = 0;

  setup() {
    super.setup();

    setInterval(this._pollRefresh, this.LGORDERS_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { marketInfo } = luxgate;
    //  marketInfo.getLGOrders.listen(this._getLGOrders);
  }

  @action refreshLGOrdersData = async () => {
    if (this.stores.networkStatus.isConnected && this.stores.networkStatus.isSynced) {
      const password = this.stores.luxgate.loginInfo.password; 
      if (password == "") return;

      const swap_coin1 = this.stores.luxgate.coinInfo.swap_coin1;
      const swap_coin2 = this.stores.luxgate.coinInfo.swap_coin2;
      if(swap_coin1 != '' && swap_coin2 != '') {
        const info: GetLGOrdersResponse = await this.getLGOrdersRequest.execute(password, swap_coin1, swap_coin2).promise;
        if(info !== "")
        {
          this.replaceOrderData(info);
        }

        this.getLGOrdersRequest.reset();
      }
    }
  }

  @action replaceOrderData(info) {
    this.LGOrdersData.bids = info.bids;
    this.LGOrdersData.numbids = info.numbids;
    this.LGOrdersData.asks = info.asks;
    this.LGOrdersData.numasks = info.numasks;
  }

  @computed get ordersData(): LGOrders {
    return this.LGOrdersData;
  }

  _pollRefresh = async () => {
    if(!this.stores.sidebar.isShowingLuxtre)
    {
      await this.refreshCoinPrice();
      await this.refreshLGOrdersData();
    } 
  }

//////////////////////////////////////////////////////////////
/* ------------------- Transactions ----------------------- */

  @action _addLGTransactions = (info: LGTransactions) => {
    for(var i=0; i < this.lstLGTransactions.length; i++)
    {
      if(this.lstLGTransactions[i].coin === info.coin)
      {
        this.lstLGTransactions[i] = info;    
        return;
      }
    }
    this.lstLGTransactions.push(info);
  };

  @action _removeLGTransactions = (index: number) => {
    this.lstLGTransactions.splice(index, 1);
  };

  @computed get lgTransactionsList(): Array<LGTransactions> {
    return this.lstLGTransactions;
  }


//////////////////////////////////////////////////////////////
/* ------------------- TradeArray ----------------------- */

  @action _addLGTradeArray = (info: LGTradeArray) => {
    for(var i=0; i < this.lstLGTradeArray.length; i++)
    {
      if(this.lstLGTradeArray[i].coin === info.coin)
      {
        this.lstLGTradeArray[i] = info;    
        return;
      }
    }
    this.lstLGTradeArray.push(info);
  };

  @action _removeLGTradeArray = (index: number) => {
    this.lstLGTradeArray.splice(index, 1);
  };


  @computed get lgTradeArrayList(): Array<LGTradeArray> {
    return this.lstLGTradeArray;
  }


//////////////////////////////////////////////////////////////
/* ------------------- PriceArray ----------------------- */

  @action _addLGPriceArray = (info: LGPriceArray) => {
    for(var i=0; i < this.lstLGPriceArray.length; i++)
    {
      if(this.lstLGPriceArray[i].coin === info.coin)
      {
        this.lstLGPriceArray[i] = info;    
        return;
      }
    }
    this.lstLGPriceArray.push(info);
  };

  @action _removeLGPriceArray = (index: number) => {
    this.lstLGPriceArray.splice(index, 1);
  };

  @computed get lgPriceArrayList(): Array<LGPriceArray> {
    return this.lstLGPriceArray;
  }


  @action refreshCoinPrice = async () => {
    const password = this.stores.luxgate.loginInfo.password; 
    if (password == "") return 0;

    const coin1 = this.stores.luxgate.coinInfo.swap_coin1;
    const coin2 = this.stores.luxgate.coinInfo.swap_coin2;

    if(coin1 == coin2) return 0;

    const price: GetCoinPriceResponse = await this.getCoinPriceRequest.execute(password, coin1, coin2).promise;
    this.setCoinPrice(price);
  }

  @action setCoinPrice(price){
    this.coinPrice = price;
  }

}
