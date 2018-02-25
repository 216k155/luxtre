// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxBlockNumber } from './types';

export type GetLuxBlockNumberParams = {
  ca: string,
};

/**
 * Returns the number of most recent block.
 * @param ca
 * @returns {Promise<number>} integer of the current block number the client is on.
 */

export const getLuxBlockNumber = async (
  { ca }: GetLuxBlockNumberParams
): Promise<LuxBlockNumber> => {
  const response = await request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: []
  });
  return parseInt(response, 16);
};
