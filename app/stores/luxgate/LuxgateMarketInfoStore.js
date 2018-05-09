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
  GetLGTransactionsResponse, 
  GetLGTradeArrayResponse,
  GetLGPriceArrayResponse
} from '../../api/common';

export default class LuxgateMarketInfoStore extends Store {

  LGORDERS_REFRESH_INTERVAL = 10000;

  // REQUESTS
//  @observable getLGOrdersRequest: CachedRequest<GetLGOrdersResponse> = new CachedRequest(this.api.luxgate.getLGOrders);
//  @observable getLGTransactionsRequest: CachedRequest<GetLGTransactionsResponse> = new CachedRequest(this.api.luxgate.getLGTransactions);
//  @observable getLGTradeArrayRequest: CachedRequest<GGetLGTradeArrayResponse> = new CachedRequest(this.api.luxgate.getLGTradeArray);
//  @observable getLGPriceArrayRequest: CachedRequest<GGetLGPriceArrayResponse> = new CachedRequest(this.api.luxgate.getLGPriceArray);

  @observable getLGOrdersRequest: Request<GetLGOrdersResponse> = new Request(this.api.luxgate.getLGOrders);

  @observable LGOrdersData: Array<LGOrders> = [];
  @observable lstLGTransactions: Array<LGTransactions> = [];
  @observable lstLGTradeArray: Array<LGTradeArray> = [];
  @observable lstLGPriceArray: Array<LGPriceArray> = [];

  setup() {
    super.setup();

    setInterval(this._pollRefresh, this.LGORDERS_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { marketInfo } = luxgate;
    //  marketInfo.getLGOrders.listen(this._getLGOrders);
  }
/*
  _getLGOrders = async ( coin: string ) => {
    const info: GetLGOrdersResponse = await this.getLGOrdersRequest.execute(coin).promise;
    if(info !== "")
    {
      const objInfo = JSON.parse(info);
      const balance = objInfo.balance;
      const address = objInfo.smartaddress;
      const height = objInfo.height;
      const status = objInfo.status;
      this._addLGOrders(new LGOrders( { coin, balance, address, height, status }));
    }
    else
    {
      const balance = 0;
      const address = '';
      const height = -1;
      const status = 'inactive';
      this._addLGOrders(new LGOrders( { coin, balance, address, height, status }));
    }

    this.getLGOrdersRequest.reset();
  };
*/
  @action refreshLGOrdersData = async () => {
    if (this.stores.networkStatus.isConnected && this.stores.networkStatus.isSynced) {
      const swap_coin1 = this.stores.luxgate.coinInfo.swap_coin1;
      const swap_coin2 = this.stores.luxgate.coinInfo.swap_coin2;
      if(swap_coin1 != '' && swap_coin2 != '') {
        const info: GetLGOrdersResponse = await this.getLGOrdersRequest.execute(swap_coin1, swap_coin2).promise;
        if(info !== "")
        {
          const objInfo = JSON.parse(info);
          const sellers = JSON.stringify(objInfo.bids);
          const sellerCount = objInfo.numbids;
          const buyers = JSON.stringify(objInfo.asks);
          const buyerCount = objInfo.numasks;
        //  this._addLGOrders(new LGOrders( { sellers, sellerCount, buyers, buyerCount }));
        }

        this.getLGOrdersRequest.reset();
//        this.getLGOrdersRequest.invalidate({ immediately: false });
//        this.getLGOrdersRequest.execute(swap_coin1, swap_coin2);
      }
    }
  }

  @computed get ordersData(): string {
    return this.LGOrdersData;
  }

  _pollRefresh = async () => {
    if(!this.stores.sidebar.isShowingLuxtre)
    {
      this.LGOrdersData = await this.refreshLGOrdersData();
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

}
