// @flow
import { observable } from 'mobx';

export default class LGTransactions {

  @observable coin: string;
  @observable balance: number;
  @observable address: string;
  @observable height: number;
  @observable status: string;

  constructor(data: {
    coin: string,
    balance: number,
    address: string,
    height: number,
    status: string
  }) {
    Object.assign(this, data);
  }
}
