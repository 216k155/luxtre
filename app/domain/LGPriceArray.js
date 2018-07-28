// @flow
import { observable } from 'mobx';

export type LGPrice = {
  timestamp: number,
  high: number,
  low: number,
  open: number,
  close: number,
  relvolume: number,
  basevolume: number,
  aveprice: number,
  numtrades: number
};

export default class LGPriceArray {
  // [timestamp, high, low, open, close, relvolume, basevolume, aveprice, numtrades]
  @observable prices: Array<LGPrice>;

  constructor(data: { prices: Array<LGPrice> }) {
    Object.assign(this, data);
  }
}
