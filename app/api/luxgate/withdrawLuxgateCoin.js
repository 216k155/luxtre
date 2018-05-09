// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type WithdrawLuxgateCoinParams = {
  coin: string,
  outputs: Array<Object>,
  userpass: string
};

export const withdrawLuxgateCoin = (
  { coin, outputs, userpass }: WithdrawLuxgateCoinParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'withdraw',
    coin: coin,
    outputs: outputs,
    broadcast: 1,
    userpass: userpass
  })
);
