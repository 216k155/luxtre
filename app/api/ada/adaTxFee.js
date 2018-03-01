// @flow
import type { LuxTransactionFee } from './types';
import { request } from './lib/request';

export type LuxTxFeeParams = {
  ca: string,
  sender: string,
  receiver: string,
  amount: string,
  // "groupingPolicy" - Spend everything from the address
  // "OptimizeForSize" for no grouping
  groupingPolicy: ?'OptimizeForSecurity' | 'OptimizeForSize',
};

export const luxTxFee = (
{ ca, sender, receiver, amount, groupingPolicy }: LuxTxFeeParams
): Promise<LuxTransactionFee> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: `/api/txs/fee/${sender}/${receiver}/${amount}`,
    port: 8090,
    ca,
  }, {}, { groupingPolicy })
);
