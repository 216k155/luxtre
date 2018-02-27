// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export type IsLuxValidAddressParams = {
  address: string,
};

export const isLuxValidAddress = async (
  { address }: IsLuxValidAddressParams
): Promise<boolean> =>  {
  const response = await request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'validateaddress',
    params: [address] 
  });
  return response.isvalid ? true : false;
};
