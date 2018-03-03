// @flow
import type { LuxAccounts } from './types';
import { request } from './lib/request';

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
