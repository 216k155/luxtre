// @flow
import { observable } from 'mobx';

export default class MasterNode {

  @observable address: string = '';
  @observable rank: number;
  @observable active: number;
  @observable activeSeconds: number;
  @observable lastSeen: Date;
  @observable pubKey: string;

  constructor(data: {
    address: string,
    rank: number,
    active: number,
    activeSeconds: number,
    lastSeen: Date,
    pubKey: string
  }) {
    Object.assign(this, data);
  }
}
