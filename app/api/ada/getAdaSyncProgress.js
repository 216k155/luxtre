// @flow
import type { LuxSyncProgressResponse } from './types';
import { request } from './lib/request';

export type GetLuxSyncProgressParams = {
  ca: string,
};

export const getLuxSyncProgress = (
  { ca }: GetLuxSyncProgressParams
): Promise<LuxSyncProgressResponse> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/settings/sync/progress',
    port: 8090,
    ca,
  })
);
