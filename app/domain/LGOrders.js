// @flow
import { observable } from 'mobx';

export default class LGOrders {

  @observable sellers: string;
  @observable sellerCount: number;
  @observable buyers: string;
  @observable buyerCount: number;

  constructor(data: {
    sellers: string,
    sellerCount: number,
    buyers: string,
    buyerCount: number,
  }) {
    Object.assign(this, data);
  }
}
