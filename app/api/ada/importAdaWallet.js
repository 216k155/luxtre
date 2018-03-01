// @flow
import type { LuxWallet } from './types';
import { request } from './lib/request';

export type ImportLuxWalletParams = {
  ca: string,
  filePath: string,
  walletPassword: ?string,
};

export const importLuxWallet = (
  { ca, walletPassword, filePath }: ImportLuxWalletParams
): Promise<LuxWallet> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/wallets/keys',
    port: 8090,
    ca,
  }, { passphrase: walletPassword }, filePath)
);
