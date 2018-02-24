// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxTransaction } from './types';

export type GetLuxTransactionByHashParams = {
  ca: string,
  txHash: string
};

export const getLuxTransactionByHash = (
  { ca, txHash }: GetLuxTransactionByHashParams
): Promise<LuxTransaction> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'eth_getTransactionByHash',
    params: [txHash]
  })
);
