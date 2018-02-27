// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxAddresses } from './types';

export type GetLuxAddressesByAccountParams = {
  account: string
};

export const getLuxAddressesByAccount = (
  { account }: GetLuxAddressesByAccountParams
): Promise<LuxAddresses> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'getaddressesbyaccount',
    params: [
      account
    ]
  })
);

