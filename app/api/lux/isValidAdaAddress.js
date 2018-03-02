// @flow
import { request } from './lib/request';

export type IsValidLuxAddressParams = {
  ca: string,
  address: string,
};

export const isValidLuxAddress = (
  { ca, address }: IsValidLuxAddressParams
): Promise<boolean> => {
  const encodedAddress = encodeURIComponent(address);
  return request({
    hostname: 'localhost',
    method: 'GET',
    path: `/api/addresses/${encodedAddress}`,
    port: 8090,
    ca,
  });
};
