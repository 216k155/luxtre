// @flow

// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxWalletPassphrase } from './types';

export type ChangeLuxWalletPassphraseParams = {
  oldPassword: ?string,
  newPassword: ?string,
};

export const changeLuxWalletPassphrase = (
  { oldPassword, newPassword }: ChangeLuxWalletPassphraseParams
): Promise<LuxWalletPassphrase> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'walletpassphrasechange',
    params: [
      oldPassword || '',
      newPassword || '',
    ]
  })
);


/*

import type { LuxWallet } from './types';
import { request } from './lib/request';
import { encryptPassphrase } from './lib/encryptPassphrase';

export type ChangeLuxWalletPassphraseParams = {
  ca: string,
  walletId: string,
  oldPassword: ?string,
  newPassword: ?string,
};

export const changeLuxWalletPassphrase = (
  { ca, walletId, oldPassword, newPassword }: ChangeLuxWalletPassphraseParams
): Promise<LuxWallet> => {
  const encryptedOldPassphrase = oldPassword ? encryptPassphrase(oldPassword) : null;
  const encryptedNewPassphrase = newPassword ? encryptPassphrase(newPassword) : null;
  return request({
    hostname: 'localhost',
    method: 'POST',
    path: `/api/wallets/password/${walletId}`,
    port: 9888,
    ca,
  }, { old: encryptedOldPassphrase, new: encryptedNewPassphrase });
};
*/