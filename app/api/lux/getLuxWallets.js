// @flow
import type { LuxWallets } from './types';
import { request } from './lib/request';

export type GetLuxWalletParams = {
  ca: string,
};

export const getLuxWallets = (
  { ca }: GetLuxWalletParams
  ): Promise<LuxWallets> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/wallets',
    port: 9888,
    ca,
  })
);
