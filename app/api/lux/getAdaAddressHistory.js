// @flow
import type { LuxTransactions } from './types';
import { request } from './lib/request';

export type GetLuxAddressHistoryParams = {
  ca: string,
  accountId: string,
  address: string,
  skip: number,
  limit: number,
};

export const getLuxAddressHistory = (
  { ca, accountId, address, skip, limit }: GetLuxAddressHistoryParams
): Promise<LuxTransactions> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/txs/histories',
    port: 8090,
    ca,
  }, { accountId, address, skip, limit })
);
