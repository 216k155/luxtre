// @flow
import type { LuxWallet, LuxWalletInitData } from './types';
import { request } from './lib/request';

export type NewLuxWalletParams = {
  ca: string,
  password: ?string,
  walletInitData: LuxWalletInitData
};

export const newLuxWallet = (
  { ca, password, walletInitData }: NewLuxWalletParams
  ): Promise<LuxWallet> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/wallets/new',
    port: 8090,
    ca,
  }, { passphrase: password }, walletInitData)
);
