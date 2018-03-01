// @flow
import { request } from './lib/request';

export type ApplyLuxUpdateParams = {
  ca: string,
};

export const applyLuxUpdate = (
  { ca }: ApplyLuxUpdateParams
): Promise<any> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/update/apply',
    port: 8090,
    ca,
  })
);
