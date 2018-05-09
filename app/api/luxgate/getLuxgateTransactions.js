// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateTransactionsParams = {
  coin: string,
  userpass: string,
  address: string
};

export const getLuxgateTransactions = (
  { coin, userpass, address }: GetLuxgateTransactionsParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'listtransactions',
    coin: coin,
    userpass: userpass,
    address: address
  })
);
