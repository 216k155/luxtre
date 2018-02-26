// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxBlock } from './types';

export type GetLuxBlockByHashParams = {
  ca: string,
  blockHash: string,
};

export const getLuxBlockByHash = (
  { ca, blockHash }: GetLuxBlockByHashParams
): Promise<LuxBlock> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'eth_getBlockByHash',
    params: [blockHash, true] // returns the full transaction objects
  })
);
