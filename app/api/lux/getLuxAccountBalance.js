// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxWalletBalance } from './types';

export type GetLuxAccountBalanceParams = {
  ca: string,
  walletId: string,
  status: 'latest' | 'earliest' | 'pending',
};

export const getLuxAccountBalance = (
  { ca, walletId, status }: GetLuxAccountBalanceParams
): Promise<LuxWalletBalance> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'getBalance',
    params: [
      walletId,
      status
    ]
  })
);
