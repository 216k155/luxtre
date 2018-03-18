// @flow
import { observable } from 'mobx';

export default class MyMasternode {

  @observable alias: string = '';
  @observable address: string = '';
  @observable status: string = '';
  @observable collateralAddress: string = '';

  constructor(data: {
    alias: string,
    address: string,
    status: number,
    collateralAddress: number,
    privateKey: string
  }) {
    Object.assign(this, data);
  }
}
