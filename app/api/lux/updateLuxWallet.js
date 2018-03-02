// @flow
import type { LuxWallet } from './types';
import { request } from './lib/request';

export type UpdateLuxWalletParams = {
  ca: string,
  walletId: string,
  walletMeta: {
    cwName: string,
    cwAssurance: string,
    cwUnit: number,
  }
};

export const updateLuxWallet = (
  { ca, walletId, walletMeta }: UpdateLuxWalletParams
): Promise<LuxWallet> => (
  request({
    hostname: 'localhost',
    method: 'PUT',
    path: `/api/wallets/${walletId}`,
    port: 8090,
    ca,
  }, {}, walletMeta)
);
