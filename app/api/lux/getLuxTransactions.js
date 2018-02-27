// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxTransactions } from './types';

export type GetLuxTransactionsParams = {
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
  { walletId, fromBlock, toBlock }: GetLuxTransactionsParams
): Promise<LuxTransactions> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'listtransactions',
    params: [
      walletId,
      toBlock - fromBlock,
      fromBlock
    ],
  })
);
