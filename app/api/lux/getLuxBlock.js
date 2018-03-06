// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxBlock } from './types';

export type GetLuxBlockByHashParams = {
  blockHash: string,
};

export const getLuxBlockByHash = (
  { blockHash }: GetLuxBlockByHashParams
): Promise<LuxBlock> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'getblock',
    params: [blockHash, 1] // returns the full transaction objects
  })
);
