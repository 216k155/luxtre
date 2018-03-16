// @flow
import { observable, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import WalletStore from '../WalletStore';
import Wallet from '../../domain/Wallet';
import { matchRoute, buildRoute } from '../../utils/routing';
import Request from '.././lib/LocalizedRequest';
import { ROUTES } from '../../routes-config';
import type {
  CreateMasterNodeResponse, 
  GetMasterNodeGenKeyResponse,
  GetMasterNodeListResponse,
  StartMasterNodeResponse, 
  StartManyMasterNodeResponse,
  StopMasterNodeResponse, 
  StopManyMasterNodeResponse,
  GetMasterNodeOutputsResponse, 
} from '../../api/common';

export default class LuxMasterNodesStore extends Store {

  // REQUESTS
  @observable createMasterNodeRequest: Request<CreateMasterNodeResponse> = new Request(this.api.lux.createMasterNode);
  @observable getMasterNodeGenKeyRequest: Request<GetMasterNodeGenKeyResponse> = new Request(this.api.lux.getMasterNodeGenKey);
  @observable getMasterNodeListRequest: Request<GetMasterNodeListResponse> = new Request(this.api.lux.getMasterNodeList);
  @observable startMasterNodeRequest: Request<StartMasterNodeResponse> = new Request(this.api.lux.startMasterNode);
  @observable startManyMasterNodeRequest: Request<StartManyMasterNodeResponse> = new Request(this.api.lux.startManyMasterNode);
  @observable stopMasterNodeRequest: Request<StopMasterNodeResponse> = new Request(this.api.lux.stopMasterNode);
  @observable stopManyMasterNodeRequest: Request<StopManyMasterNodeResponse> = new Request(this.api.lux.stopManyMasterNode);
  @observable getMasterNodeOutputsRequest: Request<GetMasterNodeOutputsResponse> = new Request(this.api.lux.getMasterNodeOutputs);


  
  setup() {
    super.setup();
    const { router, lux } = this.actions;
    const { masternodes } = lux;
    masternodes.createMasterNode.listen(this._create);
    router.goToRoute.listen(this._onRouteChange);
  }

}