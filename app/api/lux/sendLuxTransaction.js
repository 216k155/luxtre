// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxTxHash } from './types';

export type SendLuxTransactionParams = {
  to: string,
  value: BigNumber,
};

export const sendLuxTransaction = (
  { to, value }: SendLuxTransactionParams
): Promise<LuxTxHash> => {
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'sendtoaddress',
    params: [
      to,
      value.toString(16),
    ]
  })
};
