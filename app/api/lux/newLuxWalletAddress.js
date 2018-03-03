// @flow
import type { LuxAddress } from './types';
import { request } from './lib/request';

export type NewLuxWalletAddressParams = {
  ca: string,
  password: ?string,
  accountId: string,
};

export const newLuxWalletAddress = (
  { ca, password, accountId }: NewLuxWalletAddressParams
): Promise<LuxAddress> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/addresses',
    port: 9888,
    ca,
  }, { passphrase: password }, accountId)
);

