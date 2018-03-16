// @flow
import Action from '../lib/Action';

// ======= WALLET ACTIONS =======

export default class MasterNodesActions {
  createMasterNode: Action<{ alias: string}> = new Action();
  getMasterNodeGenKey: Action<any> = new Action();
  startMasterNode: Action<{ alias: string, password: string}> = new Action();
  startManyMasterNode: Action<{ password: string}> = new Action();
  stopMasterNode: Action<{ alias: string, password: string}> = new Action();
  stopManyMasterNode: Action<{ password: string}> = new Action();
  getMasterNodeOutputs: Action<any> = new Action();
}
