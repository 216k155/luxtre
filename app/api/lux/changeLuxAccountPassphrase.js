// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxAccountPassphrase } from './types';

export type ChangeLuxAccountPassphraseParams = {
  ca: string,
  walletId: string,
  oldPassword: ?string,
  newPassword: ?string,
};

export const changeLuxAccountPassphrase = (
  { ca, walletId, oldPassword, newPassword }: ChangeLuxAccountPassphraseParams
): Promise<LuxAccountPassphrase> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'daedalus_changePassphrase',
    params: [
      walletId,
      oldPassword || '',
      newPassword || '',
    ]
  })
);
