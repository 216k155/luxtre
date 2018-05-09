// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import CoinInfo from '../../domain/CoinInfo';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import CachedRequest from '../lib/LocalizedCachedRequest';
import { ROUTES } from '../../routes-config';

import type {
  GetCoinInfoResponse, 
} from '../../api/common';

export default class LuxgateCoinInfoStore extends Store {

  COININFO_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getCoinInfoRequest: Request<GetCoinInfoResponse> = new Request(this.api.luxgate.getCoinInfo);
  @observable sendCoinRequest: Request<boolean> = new Request(this.api.luxgate.withdraw);
  
  @observable lstCoinInfo: Array<CoinInfo> = [];

  setup() {
    super.setup();

  //  setInterval(this._pollRefresh, this.COININFO_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { coinInfo } = luxgate;
    coinInfo.getCoinInfo.listen(this._getCoinInfo);
    coinInfo.sendCoin.listen(this._sendCoin);
    //coininfo.getcoinarray.listen(this._createMasternode);
    //coininfo.getbalanacefromaddress
    //router.goToRoute.listen(this._onRouteChange);
  }

  _getCoinInfo = async ( coin: string ) => {
    const info: GetCoinInfoResponse = await this.getCoinInfoRequest.execute(coin).promise;
    if(info !== "")
    {
      const objInfo = JSON.parse(info);
      const balance = objInfo.balance;
      const address = objInfo.smartaddress;
      const height = objInfo.height;
      const status = objInfo.status;
      this._addCoinInfo(new CoinInfo( { coin, balance, address, height, status }));
    }
    else
    {
      const balance = 0;
      const address = '';
      const height = -1;
      const status = 'inactive';
      this._addCoinInfo(new CoinInfo( { coin, balance, address, height, status }));
    }

    this.getCoinInfoRequest.reset();
  };

  _sendCoin = async ( transactionDetails: {
    coin: ?string,
    receiver: string,
    amount: Number
  }) => {
    const { coin, receiver, amount} = transactionDetails;
    await this.sendCoinRequest.execute({
      coin: coin, 
      address: receiver, 
      amount: amount});
    this.actions.dialogs.closeActiveDialog.trigger();
    this.sendCoinRequest.reset();
  };

  @action refreshCoinInfoData = () => {
    if (this.stores.networkStatus.isConnected) {
    }
  }

  @computed get coinInfoList(): Array<CoinInfo> {
    return this.lstCoinInfo;
  }

  @action _addCoinInfo = (info: CoinInfo) => {
    for(var i=0; i < this.lstCoinInfo.length; i++)
    {
      if(this.lstCoinInfo[i].coin === info.coin)
      {
        this.lstCoinInfo[i] = info;    
        return;
      }
    }
    this.lstCoinInfo.push(info);
  };

  @action _removeCoinInfo = (index: number) => {
    this.lstCoinInfo.splice(index, 1);
  };
  
  //_pollRefresh = async () => {
  //  this.stores.networkStatus.isSynced && await this.refreshCoinInfoData()
  //}

}
