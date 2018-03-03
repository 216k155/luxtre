// @flow
import type { LuxTransaction } from './types';
import { request } from './lib/request';

export type NewLuxPaymentParams = {
  ca: string,
  sender: string,
  receiver: string,
  amount: string,
  password: ?string,
  // "groupingPolicy" - Spend everything from the address
  // "OptimizeForSize" for no grouping
  groupingPolicy: ?'OptimizeForSecurity' | 'OptimizeForSize',
};


export const newLuxPayment = (
  { ca, sender, receiver, amount, groupingPolicy, password }: NewLuxPaymentParams
): Promise<LuxTransaction> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: `/api/txs/payments/${sender}/${receiver}/${amount}`,
    port: 9888,
    ca,
  }, { passphrase: password }, { groupingPolicy })
);
