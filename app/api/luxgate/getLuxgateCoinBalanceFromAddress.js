// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetBalanceFromAddressParams = {
  coin: string,
  password: string,
  address: string
};

export const getLuxgateCoinBalanceFromAddress = (
  { coin, password, address }: GetBalanceFromAddressParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'getbalance',
    coin: coin,
    password: password,
    address: address
  })
);
