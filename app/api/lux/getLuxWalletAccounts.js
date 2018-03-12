// @flow
import type { LuxAccounts } from './types';
import { request } from './lib/request';


export type GetLuxWalletAccountsParams = {
  ca: string,
  walletId: string,
};

export const getLuxWalletAccounts = (
  { ca, walletId }: GetLuxWalletAccountsParams
): Promise<LuxAccounts> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/accounts',
    port: 9888,
    ca,
  }, { accountId: walletId })
);
