// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export type setLuxAccountParams = {
  address: string,
  walletId: string
};

export const setLuxAccount = (
  { address, walletId }: setLuxAccountParams
): Promise<void> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'setaccount',
    params: [
      address,
      walletId
    ]
  })
);
