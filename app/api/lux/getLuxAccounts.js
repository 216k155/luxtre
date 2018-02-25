// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxAccounts } from './types';

export type GetLuxAccountsParams = {
  ca: string,
};

export const getLuxAccounts = (
  { ca }: GetLuxAccountsParams
): Promise<LuxAccounts> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'listAccount',
  })
);
