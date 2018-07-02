// @flow
import Action from '../lib/Action';

// ======= CONTRACT ACTIONS =======

export default class ContractsActions {
  createContract: Action<{   
    bytecode: string, 
    gasLimit: number, 
    gasPrice: number, 
    senderaddress: string, 
  }> = new Action();
  
  callContract: Action<{ 
    address: string,
    data: string,
    senderaddress: string
  }> = new Action();
  
  sendToContract: Action<{
    contractaddress: string,
    datahex: string,
    amount: number,
    gasLimit: number,
    gasPrice: number,
    senderaddress: string,
  }> = new Action();

  saveContract: Action<{
    bytecode: string,
    abi: string,
    contractaddress: string,
    amount: number,
    gaslimit: number,
    gasprice: number,
    senderaddress: string,
  }> = new Action();

  saveSolc: Action<{
    sompileVersion: string,
    source: string,
    bytecode: string,
    abi: string,
  }> = new Action();

  saveSoljsonSources:Action<any> = new Action();

}
