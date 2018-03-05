// @flow
import type { LuxAccounts } from './types';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export const getLuxAccounts = (
): Promise<LuxAccounts> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'listaccounts',
  })
);


/*
export type GetLuxAccountsParams = {
  ca: string,
};

export const getLuxAccounts = (
  { ca }: GetLuxAccountsParams
): Promise<LuxAccounts> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/accounts',
    port: 9888,
    ca,
  })
);
*/