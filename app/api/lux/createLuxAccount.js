// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxWalletId } from './types';

export type CreateLuxAccountParams = {
  ca: string,
  privateKey: string,
  password: ?string,
};

export const createLuxAccount = (
  { ca, privateKey, password }: CreateLuxAccountParams
): Promise<LuxWalletId> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'personal_importRawKey',
    params: [
      privateKey,
      password || '',
    ]
  })
);
