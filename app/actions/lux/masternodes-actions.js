// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class MasternodesActions {
  createMasternode: Action<{ alias: string}> = new Action();
  getMasternodeGenkey: Action<any> = new Action();
  startMasternode: Action<{ alias: string, password: string}> = new Action();
  startManyMasternode: Action<{ password: string}> = new Action();
  stopMasternode: Action<{ alias: string, password: string}> = new Action();
  stopManyMasternode: Action<{ password: string}> = new Action();
  getMasternodeOutputs: Action<any> = new Action();
}
