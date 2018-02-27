// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxTransaction } from './types';

export type GetLuxTransactionByHashParams = {
  txHash: string
};

export const getLuxTransactionByHash = (
  { txHash }: GetLuxTransactionByHashParams
): Promise<LuxTransaction> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'gettransaction',
    params: [txHash]
  })
);
