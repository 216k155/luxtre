// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxWalletId } from './types';

export type GetLuxAccountAddressParams = {
  walletId: string
};

export const getLuxAccountAddress = (
  {walletId}: GetLuxAccountAddressParams
): Promise<LuxWalletId> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'getaccountaddress',
    params:[
      walletId
    ]
  })
);
