// @flow
import type { LuxWallet, LuxWalletInitData } from './types';
import { request } from './lib/request';

export type RestoreLuxWalletParams = {
  ca: string,
  walletPassword: ?string,
  walletInitData: LuxWalletInitData
};

export const restoreLuxWallet = (
  { ca, walletPassword, walletInitData }: RestoreLuxWalletParams
): Promise<LuxWallet> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/wallets/restore',
    port: 9888,
    ca,
  }, { passphrase: walletPassword }, walletInitData)
);

