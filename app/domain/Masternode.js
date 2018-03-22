// @flow
import { observable } from 'mobx';

export default class Masternode {

  @observable address: string = '';
  @observable rank: number;
  @observable active: number;
  @observable activeSeconds: number;
  @observable lastSeen: number;
  @observable pubKey: string;

  constructor(data: {
    address: string,
    rank: number,
    active: number,
    activeSeconds: number,
    lastSeen: number,
    pubKey: string
  }) {
    Object.assign(this, data);
  }
}
