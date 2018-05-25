// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';
import type { LuxgateSwapOutput } from './types';

export type SwapLuxgateCoinParams = {
  buy_coin: string,
  sell_coin: string,
  amount: number,
  value: number
};

export const swapLuxgateCoin = (
  { buy_coin, sell_coin, amount, value }: SwapLuxgateCoinParams
): Promise<LuxgateSwapOutput> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'swap',
    base: buy_coin,
    rel: sell_coin,
    relvolume: amount,
    price: value,
    password: password
  })
);
