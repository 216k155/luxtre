// @flow
import { request } from './lib/request';

export type NextLuxUpdateParams = {
  ca: string,
};

export const nextLuxUpdate = (
  { ca }: NextLuxUpdateParams
): Promise<any> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/update',
    port: 9888,
    ca,
  })
);
