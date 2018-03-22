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
  GetMasternodeListResponse,
  CreateMasternodeResponse, 
  GetMasternodeGenkeyResponse,
  StartMasternodeResponse, 
  StartManyMasternodeResponse,
  StopMasternodeResponse, 
  StopManyMasternodeResponse,
  GetMasternodeOutputsResponse, 
} from '../../api/common';

export default class LuxMasternodesStore extends Store {

  MASTERNODE_REFRESH_INTERVAL = 10000;

  // REQUESTS
  @observable getMasternodeListRequest: CachedRequest<GetMasternodeListResponse> = new CachedRequest(this.api.lux.getMasternodeList);

  @observable createMasternodeRequest: Request<CreateMasternodeResponse> = new Request(this.api.lux.createMasternode);
  @observable getMasternodeGenkeyRequest: Request<GetMasternodeGenkeyResponse> = new Request(this.api.lux.getMasternodeGenkey);
  @observable startMasternodeRequest: Request<StartMasternodeResponse> = new Request(this.api.lux.startMasternode);
  @observable startManyMasternodeRequest: Request<StartManyMasternodeResponse> = new Request(this.api.lux.startManyMasternode);
  @observable stopMasternodeRequest: Request<StopMasternodeResponse> = new Request(this.api.lux.stopMasternode);
  @observable stopManyMasternodeRequest: Request<StopManyMasternodeResponse> = new Request(this.api.lux.stopManyMasternode);
  @observable getMasternodeOutputsRequest: Request<GetMasternodeOutputsResponse> = new Request(this.api.lux.getMasternodeOutputs);

  @observable myMasternodes: Array<MyMasternode> = [];

  setup() {
    super.setup();

    setInterval(this._pollRefresh, this.MASTERNODE_REFRESH_INTERVAL);

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

  _createMasternode = async ( params: {alias: string, address: string }) => {
    const {alias, address} = params;
    const collateralAddress: CreateMasternodeResponse = await this.createMasternodeRequest.execute(alias).promise;
    const privateKey: GetMasternodeGenkeyResponse = await this.getMasternodeGenkeyRequest.execute().promise;
    this._addMyMasternode(new MyMasternode({
      alias,
      address,
      collateralAddress,
      privateKey
    }));
    this.actions.dialogs.closeActiveDialog.trigger();
    this.createMasternodeRequest.reset();
  };

  _startMasternode = async ( params: {alias: string, password: string }) => {
    const response: StartMasternodeResponse = await this.startMasternodeRequest.execute(params).promise;
    //console.log(response);
    this.actions.dialogs.closeActiveDialog.trigger();
    this.startMasternodeRequest.reset();
  };

  _stopMasternode = async ( params: { alias: string, password: string  }) => {
    const response: StopMasternodeResponse = await this.stopMasternodeRequest.execute(params).promise;
    //console.log(response);
    this.actions.dialogs.closeActiveDialog.trigger();
    this.stopMasternodeRequest.reset();
  };

  _startManyMasternode = async ( params: { password: string }) => {
    const { password } = params;
    const response: StartManyMasternodeResponse = await this.startManyMasternodeRequest.execute(password).promise;
    //console.log(response);
    this.actions.dialogs.closeActiveDialog.trigger();
    this.startManyMasternodeRequest.reset();
  };

  _stopManyMasternode = async ( params: { password: string  }) => {
    const { password } = params;
    const response: StopManyMasternodeResponse = await this.stopManyMasternodeRequest.execute(password).promise;
    //console.log(response);
    this.actions.dialogs.closeActiveDialog.trigger();
    this.stopManyMasternodeRequest.reset();
  };

  _removeMasternode = async ( params: {alias: string}) => {
    const alias = params.alias;
    for(var i=0; i < this.myMasternodes.length; i++)
    {
      if(this.myMasternodes.alias === alias)
      {
        this._removeMyMasternode(i);    
        break;
      }
    }
    this.actions.dialogs.closeActiveDialog.trigger();
  };

  @computed get masternodeslist(): Array<Masternode> {
    const result = this.getMasternodeListRequest.result;
    return result ? result.masternodes : [];
  }

  @computed get totalActivated(): number {
    const result = this.getMasternodeListRequest.result;
    return result ? result.masternodes.length : 0;
  }

  @computed get myMasternodeList(): Array<MyMasternode> {
    return this.myMasternodes;
  }

  @action _addMyMasternode = (masternode: MyMasternode) => {
    for(var i=0; i < this.myMasternodes.length; i++)
    {
      if(this.myMasternodes[i].alias === masternode.alias)
      {
        this.myMasternodes[i] = masternode;    
        return;
      }
    }
    this.myMasternodes.push(masternode);
  };

  @action _removeMyMasternode = (index: number) => {
    this.myMasternodes.splice(index, 1);
  };

  @action refreshMasternodesData = () => {
    if (this.stores.networkStatus.isConnected) {
        this.getMasternodeListRequest.invalidate({ immediately: false });
        this.getMasternodeListRequest.execute();
    }
  }

  _pollRefresh = async () => {
    this.stores.networkStatus.isSynced && await this.refreshMasternodesData()
  }

  getMasternodeOutputs = () => {
    return this.api.lux.getMasternodeOutputs();
  }

}