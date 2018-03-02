// @flow
import { request } from './lib/request';

export type LuxTestResetParams = {
  ca: string,
};

export const luxTestReset = (
  { ca }: LuxTestResetParams
): Promise<void> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/test/reset',
    port: 8090,
    ca,
  })
);
