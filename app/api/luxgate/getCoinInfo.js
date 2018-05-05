// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetCoinInfoParams = {
  coin: string,
  password: string
};

export const getCoinInfo = (
  { coin, password }: GetCoinInfoParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'getcoin',
    userpass: password,
    coin: coin
  })
);
