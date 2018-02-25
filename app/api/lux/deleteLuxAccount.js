// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';

export type DeleteLuxAccountBalanceParams = {
  ca: string,
  walletId: string,
};

export const deleteLuxAccount = (
  { ca, walletId }: DeleteLuxAccountBalanceParams
): Promise<boolean> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'daedalus_deleteWallet',
    params: [walletId]
  })
);
