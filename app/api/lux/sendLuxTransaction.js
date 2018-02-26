// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxTxHash } from './types';

export type SendLuxTransactionParams = {
  ca: string,
  from: string,
  to: string,
  value: BigNumber,
  password: string,
  gasPrice: BigNumber,
};

export const sendLuxTransaction = (
  { ca, from, to, value, password, gasPrice }: SendLuxTransactionParams
): Promise<LuxTxHash> => {
  const txParams = {
    from,
    to,
    value: value.toString(16),
    gasPrice: gasPrice.toString(16),
  };
  return (
    request({
      hostname: LUX_API_HOST,
      method: 'POST',
      path: '/',
      port: LUX_API_PORT,
      ca,
    }, {
      jsonrpc: '2.0',
      method: 'personal_sendTransaction',
      params: [
        txParams,
        password,
      ]
    })
  );
};
