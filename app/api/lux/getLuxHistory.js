// @flow
import type { LuxTransactions } from './types';
import { request } from './lib/request';

export type GetLuxHistoryParams = {
  ca: string,
  walletId: ?string,
  accountId: ?string,
  address: ?string,
  skip: number,
  limit: number,
};

export const getLuxHistory = (
  { ca, walletId, accountId, address, skip, limit }: GetLuxHistoryParams
): Promise<LuxTransactions> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/txs/histories',
    port: 9888,
    ca,
  }, { walletId, accountId, address, skip, limit })
);
