// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type SetLuxgateDisableWalletParams = {
  password: string,
  coin: string,
};

export const setLuxgateDisableWallet = (
  { password, coin }: SetLuxgateDisableWalletParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'disable',
    password: password,
    coin: coin
  })
);
