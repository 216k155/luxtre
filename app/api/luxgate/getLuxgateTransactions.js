// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateTransactionsParams = {
  coin: string,
  password: string,
  address: string
};

export const getLuxgateTransactions = (
  { coin, password, address }: GetLuxgateTransactionsParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'listtransactions',
    coin: coin,
    password: password,
    address: address
  })
);
