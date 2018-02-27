// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export type ImportLuxPrivateKeyParams = {
  privateKey: string,
  label: string,
  rescan: boolean
};

export const importLuxPrivateKey = (
  { privateKey, label, rescan }: ImportLuxPrivateKeyParams
): Promise<void> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'importprivkey',
    params: [
      privateKey,
      label,
      rescan
    ]
  })
);
