// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxTransactions } from './types';

export type GetLuxTransactionsParams = {
  ca: string,
  walletId: string,
  fromBlock: number,
  toBlock: number,
};

/**
 * Returns account transactions (both sent and received) from a range of blocks.
 * The response also includes pending transactions.
 * @param ca (the TLS certificate)
 * @param walletId
 * @param fromBlock (in the past)
 * @param toBlock (more recent)
 * @returns {*}
 */
export const getLuxTransactions = (
  { ca, walletId, fromBlock, toBlock }: GetLuxTransactionsParams
): Promise<LuxTransactions> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'listTransaction',
    params: [
      walletId,
      new BigNumber(fromBlock).toString(16),
      new BigNumber(toBlock).toString(16),
    ],
  })
);
