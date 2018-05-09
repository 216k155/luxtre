// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import LGOrders from '../../domain/LGOrders';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import CachedRequest from '../lib/LocalizedCachedRequest';
import { ROUTES } from '../../routes-config';

import type {
  GetLGOrdersResponse, 
} from '../../api/common';

export default class LuxgateOrdersStore extends Store {

  LGORDERS_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getLGOrdersResponse: Request<GetLGOrdersResponse> = new Request(this.api.luxgate.getLGOrders);
  
  @observable lstLGOrders: Array<LGOrders> = [];

  setup() {
    super.setup();

    setInterval(this._pollRefresh, this.LGORDERS_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { coinInfo } = luxgate;
    coinInfo.getLGOrders.listen(this._getLGOrders);
    //coininfo.getcoinarray.listen(this._createMasternode);
    //coininfo.getbalanacefromaddress
    //router.goToRoute.listen(this._onRouteChange);
  }

  _getLGOrders = async ( coin: string ) => {
    const info: GetLGOrdersResponse = await this.getLGOrdersResponse.execute(coin).promise;
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

    this.getLGOrdersResponse.reset();
  };

  @action refreshLGOrdersData = () => {
    if (this.stores.networkStatus.isConnected) {
    }
  }

  @computed get coinInfoList(): Array<LGOrders> {
    return this.lstLGOrders;
  }

  @action _addLGOrders = (info: LGOrders) => {
    for(var i=0; i < this.lstLGOrders.length; i++)
    {
      if(this.lstLGOrders[i].coin === info.coin)
      {
        this.lstLGOrders[i] = info;    
        return;
      }
    }
    this.lstLGOrders.push(info);
  };

  @action _removeLGOrders = (index: number) => {
    this.lstLGOrders.splice(index, 1);
  };
  
  _pollRefresh = async () => {
    !this.stores.sidebar.isShowingLuxtre && await this.refreshLGOrdersData()
  }

}
