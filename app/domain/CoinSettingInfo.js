// @flow
import { observable } from 'mobx';

export default class CoinSettingInfo {

  @observable coin: string;
  @observable wallet: boolean;

  constructor(data: {
    coin: string,
    wallet: boolean,
  }) {
    Object.assign(this, data);
  }
}
