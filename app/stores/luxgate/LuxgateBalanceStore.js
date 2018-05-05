// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import MyMasternode from '../../domain/MyMasternode';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import CachedRequest from '../lib/LocalizedCachedRequest';
import { ROUTES } from '../../routes-config';
import type {
  GetMasternodeOutputsResponse, 
} from '../../api/common';

export default class LuxgateBalanceStore extends Store {

  LUXGATE_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getMasternodeListRequest: CachedRequest<GetMasternodeListResponse> = new CachedRequest(this.api.lux.getMasternodeList);

  @observable getMasternodeOutputsRequest: Request<GetMasternodeOutputsResponse> = new Request(this.api.lux.getMasternodeOutputs);

  @observable myMasternodes: Array<MyMasternode> = [];

  setup() {
    super.setup();

    setInterval(this._pollRefresh, this.LUXGATE_REFRESH_INTERVAL);

    const { router, lux } = this.actions;
    const { masternodes } = lux;
    masternodes.createMasternode.listen(this._createMasternode);
    masternodes.removeMasternode.listen(this._removeMasternode);
    masternodes.startMasternode.listen(this._startMasternode);
    masternodes.stopMasternode.listen(this._stopMasternode);
    masternodes.startManyMasternode.listen(this._startManyMasternode);
    masternodes.stopManyMasternode.listen(this._stopManyMasternode);
    //router.goToRoute.listen(this._onRouteChange);
  }

  @action refreshLuxgateData = () => {
    if (this.stores.networkStatus.isConnected) {
    }
  }

  _pollRefresh = async () => {
    this.stores.networkStatus.isSynced && await this.refreshLuxgateData()
  }

  getMasternodeOutputs = () => {
    return this.api.lux.getMasternodeOutputs();
  }

}
