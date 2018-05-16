// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import CachedRequest from '../lib/LocalizedCachedRequest';
import { ROUTES } from '../../routes-config';

import type {
  GetCoinInfoResponse, 
  GetCoinBalanceResponse
} from '../../api/common';

export default class LuxgateLoginInfoStore extends Store {

  // REQUESTS
  //@observable LuxgateLoginRequest: Request<GetCoinInfoResponse> = new Request(this.api.luxgate.getCoinInfo);
  
  @observable isLuxgateLogin: boolean = false;
  @observable password: string = "";
  
  setup() {
    super.setup();

    const { router, luxgate } = this.actions;
    const { loginInfo } = luxgate;
  }
}
