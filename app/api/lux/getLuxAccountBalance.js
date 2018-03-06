// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxWalletBalance } from './types';

export type GetLuxAccountBalanceParams = {
  walletId: string,
  confirmations: number
};

export const getLuxAccountBalance = ({
  walletId,
  confirmations
}: GetLuxAccountBalanceParams): Promise<LuxWalletBalance> =>
  request(
    {
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
    },
    {
    jsonrpc: '2.0',
      method: 'getbalance'
    }
);
