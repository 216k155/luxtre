// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateCoinInfoParams = {
  coin: string,
  userpass: string
};

export const getLuxgateCoinInfo = (
  { coin, userpass }: GetLuxgateCoinInfoParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'getcoin',
    coin: coin,
    userpass: userpass
  })
);
