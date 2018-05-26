// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateCoinPriceParams = {
  password: string,
  base: string,
  rel: string
};

export const getLuxgateCoinPrice = (
  { password, base, rel }: GetLuxgateCoinPriceParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'getprice',
    password: password,
    base: base,
    rel: rel
  })
);
