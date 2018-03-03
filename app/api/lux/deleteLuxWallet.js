// @flow
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
