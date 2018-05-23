// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import LGTransactions from '../../domain/LGTransactions';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import CachedRequest from '../lib/LocalizedCachedRequest';
import { ROUTES } from '../../routes-config';

import type {
  GetLGTransactionsResponse, 
} from '../../api/common';

export default class LuxgateTransactionsStore extends Store {

  LGTRANSACTIONS_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getLGTransactionsRequest: Request<GetLGTransactionsResponse> = new Request(this.api.luxgate.getLGTransactions);
  
  @observable lstLGTransactions: Array<LGTransactions> = [];

  setup() {
    super.setup();

  //  setInterval(this._pollRefresh, this.LGTRANSACTIONS_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { coinInfo } = luxgate;
    coinInfo.getLGTransactions.listen(this._getLGTransactions);
    //coininfo.getcoinarray.listen(this._createMasternode);
    //coininfo.getbalanacefromaddress
    //router.goToRoute.listen(this._onRouteChange);
  }

  _getLGTransactions = async ( coin: string ) => {
    const info: GetLGTransactionsResponse = await this.getLGTransactionsRequest.execute(coin).promise;
    if(info !== "")
    {
      const objInfo = JSON.parse(info);
      const balance = objInfo.balance;
      const address = objInfo.smartaddress;
      const height = objInfo.height;
      const status = objInfo.status;
      this._addLGTransactions(new LGTransactions( { coin, balance, address, height, status }));
    }
    else
    {
      const balance = 0;
      const address = '';
      const height = -1;
      const status = 'inactive';
      this._addLGTransactions(new LGTransactions( { coin, balance, address, height, status }));
    }

    this.getLGTransactionsRequest.reset();
  };

  @action refreshLGTransactionsData = () => {
    if (this.stores.networkStatus.isConnected) {
    }
  }

  @computed get lgTransactionsList(): Array<LGTransactions> {
    return this.lstLGTransactions;
  }

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
  
  //_pollRefresh = async () => {
  //  this.stores.networkStatus.isSynced && await this.refreshLGTransactionsData()
  //}

}
