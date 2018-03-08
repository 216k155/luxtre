// @flow

import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';

export type RenameLuxWalletBalanceParams = {
  ca: string,
  walletId: string,
};

export const renameLuxWallet = (
  { ca, walletId }: RenameLuxWalletBalanceParams
): Promise<boolean> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'luxcore_renameWallet',
    params: [walletId]
  })
);

/*
import { request } from './lib/request';

export type DeleteLuxWalletParams = {
  ca: string,
  walletId: string,
};

export const deleteLuxWallet = (
  { ca, walletId }: DeleteLuxWalletParams
): Promise<[]> => (
  request({
    hostname: 'localhost',
    method: 'DELETE',
    path: `/api/wallets/${walletId}`,
    port: 9888,
    ca,
  })
);
*/