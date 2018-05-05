// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetCoinBalanceParams = {
  alias: string,
  password: string
};

export const getCoinBalance = (
  { alias, password }: GetCoinBalanceParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
    auth: LUXGATE_API_USER + ':' + LUXGATE_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'masternode',
    params:[
      'start-alias',
      alias,
      password
    ]
  })
);
