// @flow
import { request } from './lib/request';

export type PostponeLuxUpdateParams = {
  ca: string,
};

export const postponeLuxUpdate = (
  { ca }: PostponeLuxUpdateParams
  ): Promise<any> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/update/postpone',
    port: 8090,
    ca,
  })
);
