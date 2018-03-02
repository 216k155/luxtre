// @flow
import type { LuxTransactions } from './types';
import { request } from './lib/request';

export type GetLuxHistoryByAccountParams = {
  ca: string,
  accountId: string,
  skip: number,
  limit: number,
};

export const getLuxHistoryByAccount = (
  { ca, accountId, skip, limit }: GetLuxHistoryByAccountParams
): Promise<LuxTransactions> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/txs/histories',
    port: 8090,
    ca,
  }, { accountId, skip, limit })
);
