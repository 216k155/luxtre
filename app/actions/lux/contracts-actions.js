// @flow
import Action from '../lib/Action';

// ======= CONTRACT ACTIONS =======

export default class ContractsActions {
  createContract: Action<{   
    bytecode: string, 
    gasLimit: number, 
    gasPrice: number, 
    senderaddress: string, 
    broadcast: boolean, 
    changeToSender: boolean 
  }> = new Action();
  
  callContract: Action<{ 
    address: string,
    data: string,
    senderaddress: string,
    gasLimit: string
  }> = new Action();
  
  sendToContract: Action<{
    contractaddress: string,
    datahex: string,
    amount: number,
    gasLimit: number,
    gasPrice: number,
    senderaddress: string,
    broadcast: boolean,
    changeToSender: boolean
  }> = new Action();
}
