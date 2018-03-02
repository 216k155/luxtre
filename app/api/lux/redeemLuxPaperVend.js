// @flow
import type { LuxTransaction } from './types';
import { request } from './lib/request';

export type RedeemLuxPaperVendParams = {
  ca: string,
  walletPassword: ?string,
  redeemPaperVendedData: {
    pvWalletId: string,
    pvSeed: string,
    pvBackupPhrase: {
      bpToList: [],
    }
  }
};

export const redeemLuxPaperVend = (
  { ca, walletPassword, redeemPaperVendedData }: RedeemLuxPaperVendParams
): Promise<LuxTransaction> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/papervend/redemptions/lux',
    port: 8090,
    ca,
  }, { passphrase: walletPassword }, redeemPaperVendedData)
);
