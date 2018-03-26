// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export type StartLuxMasternodeParams = {
  alias: string,
  password: string
};

export const startLuxMasternode = (
  { alias, password }: StartLuxMasternodeParams
): Promise<string> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'masternode',
    params:[
      'start-alias',
      alias,
      password
    ]
  })
);
