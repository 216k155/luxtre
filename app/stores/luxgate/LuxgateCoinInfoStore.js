// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import CoinInfo from '../../domain/CoinInfo';
import Request from '.././lib/LocalizedRequest';

import type {
  GetCoinInfoResponse, 
  GetCoinBalanceResponse,
  SwapCoinResponse,
  SendCoinResponse,
  GetCoinPriceResponse,
} from '../../api/common';

export default class LuxgateCoinInfoStore extends Store {

  COININFO_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getCoinInfoRequest: Request<GetCoinInfoResponse> = new Request(this.api.luxgate.getCoinInfo);
  @observable getCoinBalanceRequest: Request<GetCoinBalanceResponse> = new Request(this.api.luxgate.getCoinBalanace);
  @observable sendCoinRequest: Request<SendCoinResponse> = new Request(this.api.luxgate.sendCoin);
  @observable swapCoinRequest: Request<SwapCoinResponse> = new Request(this.api.luxgate.swapCoin);
  //@observable getCoinPriceRequest: Request<GetCoinPriceResponse> = new Request(this.api.luxgate.getCoinPrice);
  
  @observable lstCoinInfo: Array<CoinInfo> = [];
  @observable swap_coin1: string = 'BTC';
  @observable swap_coin2: string = 'LUX';
  //@observable coinPrice: number = 0;

  setup() {
    super.setup();

  //  setInterval(this._pollRefresh, this.COININFO_REFRESH_INTERVAL);

    const { router, luxgate } = this.actions;
    const { coinInfo } = luxgate;
    coinInfo.getCoinInfo.listen(this._getCoinInfo);
    coinInfo.swapCoin.listen(this._swapCoin);
    coinInfo.sendCoin.listen(this._sendCoin);
    //coinInfo.getCoinPrice.listen(this._getCoinPrice);
    coinInfo.clearCoinInfo.listen(this._clearCoinInfo);
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

    //this._getCoinPrice();
  };

  _sendCoin = async ( transactionDetails: {
    coin: string,
    receiver: string,
    amount: number
  }) => {
    const { coin, receiver, amount} = transactionDetails;
    const password = this.stores.luxgate.loginInfo.password; 
    if (password == "") return;
    
    await this.sendCoinRequest.execute({
      password: password,
      coin: coin, 
      receiver: receiver, 
      amount: amount});
    this.actions.dialogs.closeActiveDialog.trigger();
    this.sendCoinRequest.reset();
    this.getCoinInfoData(coin);
  };

  _swapCoin = async ( swapDetails: {
    buy_coin: string,
    sell_coin: string,
    amount: number,
    value: number
  }) => {
    const { buy_coin, sell_coin, amount, value} = swapDetails;

    const isLogined = this.stores.luxgate.loginInfo.isLogined;  
    if(!isLogined) {
      const logData = {
        content: "First, need to login",
        type: "info"
      };
      this.actions.luxgate.logger.addLog.trigger(logData);
      return;
    } 

    const password = this.stores.luxgate.loginInfo.password; 
    if (password == "") return;
    
    await this.swapCoinRequest.execute({
      password: password,
      buy_coin: buy_coin, 
      sell_coin: sell_coin, 
      amount: amount,
      value: value});
    this.actions.dialogs.closeActiveDialog.trigger();
    this.swapCoinRequest.reset();
  };
  /*
  @action _getCoinPrice = async () => {
    const password = this.stores.luxgate.loginInfo.password; 
    if (password == "") return;

    if(this.swap_coin1 == this.swap_coin2) return;

    const price: GetCoinPriceResponse = await this.getCoinPriceRequest.execute(password, this.swap_coin1, this.swap_coin2).promise;
    this.setCoinPrice(price);
  }

  @action setCoinPrice(price){
    this.coinPrice = price;
  }
  */
  @action getCoinInfoData = async (coin: string) => {
    const isLogined = this.stores.luxgate.loginInfo.isLogined;
    if(!isLogined) return;

    const password = this.stores.luxgate.loginInfo.password; 
    if (password == "") return;
    
    const coinInfo: GetCoinInfoResponse = await this.getCoinInfoRequest.execute(password, coin).promise;
    if(coinInfo != null)
    {
      if(coin == coinInfo.coin)
      {
        const address = coinInfo.smartaddress;
        const balance = coinInfo.balance ? coinInfo.balance : await this.getCoinBalanceRequest.execute(password, coin, address).promise;
        const height = coinInfo.height;
        const status = coinInfo.status;
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
    if (this.stores.networkStatus.isConnected && this.stores.luxgate.loginInfo.isLogined) {
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
  
  @action _clearCoinInfo = () => {
    this.lstCoinInfo.splice(0, this.lstCoinInfo.length);
    // this.lstCoinInfo.length = 0;
  };

  _pollRefresh = async () => {
    await this.refreshCoinInfoData();
  }

}
