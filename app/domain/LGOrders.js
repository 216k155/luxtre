// @flow
import { observable } from 'mobx';

export default class LGOrders {

  @observable sellers: string;
  @observable sellerCount: number;
  @observable buyers: string;
  @observable buyerCount: number;

  constructor(data: {
    bids: Array,
    numbids: number,
    asks: Array,
    numasks: number,
  }) {
    Object.assign(this, data);
  }
}
