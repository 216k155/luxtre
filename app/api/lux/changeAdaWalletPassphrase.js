// @flow
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
    port: 8090,
    ca,
  }, { old: encryptedOldPassphrase, new: encryptedNewPassphrase });
};
