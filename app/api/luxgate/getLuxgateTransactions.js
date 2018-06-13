// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateTransactionsParams = {
  password: string,
  coin: string,
  address: string
};

export const getLuxgateTransactions = (
  { password, coin, address }: GetLuxgateTransactionsParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'listtransactions',
    password: password,
    coin: coin,
    address: address
  })
);
