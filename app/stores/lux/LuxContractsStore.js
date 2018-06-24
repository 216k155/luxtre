// @flow
import { observable, computed, action, runInAction } from 'mobx';
import Store from '../lib/Store';
import Request from '.././lib/LocalizedRequest';
import { ROUTES } from '../../routes-config';
import type {
  CallLuxContractResponse
} from '../../api/common';

export default class LuxContractsStore extends Store {

  // REQUESTS
  @observable createLuxContractRequest: Request<CreateLuxContractResponse> = new Request(this.api.lux.createContract);
  @observable callLuxContractRequest: Request<CallLuxContractResponse> = new Request(this.api.lux.callContract);
  @observable sendToLuxContractRequest: Request<SendToLuxContractResponse> = new Request(this.api.lux.sendToContract);

  @observable bytecode: string = '';
  @observable abi: string  = '';
  @observable gaslimit: number = 2500000;
  @observable gasprice: number = 0.0000004;
  @observable senderaddress: string = '';
  @observable contractaddress: string = '';
  @observable amount: number = 0;
  
  @observable soljsonSources: Array<string> = [];
  @observable solc_source: string = "pragma solidity ^0.4.2;\n\ncontract Ballot {\n\n    address owner;\n\n    constructor() public { owner = msg.sender; }\n\n}";
  @observable solc_bytecode: string = '';
  @observable solc_abi: string  = '';
  @observable solc_version: string  = '';

  setup() {
    super.setup();
    const { router, lux } = this.actions;
    const { contracts } = lux;
    contracts.callContract.listen(this._callContract);
    //router.goToRoute.listen(this._onRouteChange);
  }

  _callContract = async ( params: {address: string, data: string, senderaddress: string }) => {
    const response: CallLuxContractResponse = await this.callLuxContractRequest.execute(params).promise;
    this.callLuxContractRequest.reset();
  };

  createContract = async (params: {bytecode: string, gasLimit: number, gasPrice: number, senderaddress: string}) => {
    const response: CreateLuxContractResponse = await this.createLuxContractRequest.execute(params).promise;
    this.createLuxContractRequest.reset();
    return response;
  }

  sendToContract = async (params: {contractaddress: string, datahex: string, amount: number, gaslimit: number, gasprice: number, senderaddress: string, broadcast: boolean, changeToSender: boolean}) => {
    const response: SendToLuxContractResponse = await this.sendToLuxContractRequest.execute(params).promise;
    this.sendToLuxContractRequest.reset();
    return response;
  }

  saveContract = (
    params: {
      bytecode: string,
      abi: string,
      contractaddress: string,
      amount: number,
      gasLimit: number,
      gasprice: number,
      senderaddress: string,
    }) => {
      if(params.bytecode != undefined) this.bytecode = params.bytecode;
      if(params.abi != undefined) this.abi = params.abi;
      if(params.contractaddress != undefined) this.contractaddress = params.contractaddress;
      if(params.amount != undefined) this.amount = params.amount;
      if(params.gaslimit != undefined) this.gaslimit = params.gaslimit;
      if(params.gasprice != undefined) this.gasprice = params.gasprice;
      if(params.senderaddress != undefined) this.senderaddress = params.senderaddress;
    }


  @action saveSolc = (
    params: {
      compileVersion: string,
      source: string,
      bytecode: string,
      abi: string,
    }) => {
      if(params.compileVersion != undefined) this.solc_version = params.compileVersion;
      if(params.source != undefined) this.solc_source = params.source;
      if(params.bytecode != undefined) this.solc_bytecode = params.bytecode;
      if(params.abi != undefined) this.solc_abi = params.abi;
    }

  @action saveSoljsonSources = (sources: Array<string>) => {
    this.soljsonSources = sources.slice();
  }
}
