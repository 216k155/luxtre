// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxSyncProgress } from './types';

export type GetLuxSyncProgressParams = {
  ca: string,
};

export const getLuxSyncProgress = (
  { ca }: GetLuxSyncProgressParams
): Promise<LuxSyncProgress> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'eth_syncing',
  })
);
