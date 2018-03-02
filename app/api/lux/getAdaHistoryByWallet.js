// @flow
import type { LuxTransactions } from './types';
import { request } from './lib/request';

export type GetLuxHistoryByWalletParams = {
  ca: string,
  walletId: string,
  skip: number,
  limit: number,
};

export const getLuxHistoryByWallet = (
  { ca, walletId, skip, limit }: GetLuxHistoryByWalletParams
): Promise<LuxTransactions> => (
  request({
    hostname: 'localhost',
    method: 'GET',
    path: '/api/txs/histories',
    port: 8090,
    ca,
  }, { walletId, skip, limit })
);
