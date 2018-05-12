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
  GetCoinBalanceResponse
} from '../../api/common';

export default class LuxgateCoinInfoStore extends Store {

  COININFO_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getCoinInfoRequest: Request<GetCoinInfoResponse> = new Request(this.api.luxgate.getCoinInfo);
  @observable getCoinBalanceRequest: Request<GetCoinBalanceResponse> = new Request(this.api.luxgate.getCoinBalanace);
  @observable sendCoinRequest: Request<sendCoinResponse> = new Request(this.api.luxgate.sendCoin);
  
  @observable lstCoinInfo: Array<CoinInfo> = [];
  @observable swap_coin1: string = 'BTC';
  @observable swap_coin2: string = 'LUX';

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

  _getCoinInfo = async ( params: { coin: string, coin_num: number } ) => {
    const { coin, coin_num } = params;
    if(coin === 'all')
    {
      this.refreshCoinInfoData();
    }
    else
    {
      if(coin_num == 1) this.swap_coin1 = coin;
      if(coin_num == 2) this.swap_coin2 = coin;

      this.getCoinInfoData(coin);
    }
  };

  _sendCoin = async ( transactionDetails: {
    coin: string,
    receiver: string,
    amount: number
  }) => {
    const { coin, receiver, amount} = transactionDetails;
    await this.sendCoinRequest.execute({
      coin: coin, 
      receiver: receiver, 
      amount: amount});
    this.actions.dialogs.closeActiveDialog.trigger();
    this.sendCoinRequest.reset();
    this.getCoinInfoData(coin);
  };

  @action getCoinInfoData = async (coin: string) => {

    const info: GetCoinInfoResponse = await this.getCoinInfoRequest.execute(coin).promise;
    if(info !== "")
    {
      const objInfo = JSON.parse(info);
      if(coin == objInfo.coin)
      {
        const address = objInfo.smartaddress;
        const balance = objInfo.balance ? objInfo.balance : await this.getCoinBalanceRequest.execute(coin, address).promise;
        const height = objInfo.height;
        const status = objInfo.status;
        this._addCoinInfo(new CoinInfo( { coin, balance, address, height, status }));
      }
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
  }

  @action refreshCoinInfoData = async () => {
    if (this.stores.networkStatus.isConnected) {
      await this.getCoinInfoData(this.swap_coin1);
      await this.getCoinInfoData(this.swap_coin2);
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
  
  _pollRefresh = async () => {
    await this.refreshCoinInfoData();
  }

}
