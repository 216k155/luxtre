// @flow
import type { LuxTransaction } from './types';
import { request } from './lib/request';

export type RedeemLuxParams = {
  ca: string,
  walletPassword: ?string,
  walletRedeemData: {
    crWalletId: string,
    crSeed: string,
  }
};

export const redeemLux = (
{ ca, walletPassword, walletRedeemData }: RedeemLuxParams
): Promise<LuxTransaction> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/redemptions/lux',
    port: 9888,
    ca,
  }, { passphrase: walletPassword }, walletRedeemData)
);
