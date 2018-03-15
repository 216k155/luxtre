// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export type StartLuxMasterNodeParams = {
  alias: string
};

export const startLuxMasterNode = (
  { alias }: StartLuxMasterNodeParams
): Promise<object> => (
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
      alias
    ]
  })
);
