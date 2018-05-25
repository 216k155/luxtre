// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type SetLuxgateLocalWalletParams = {
  password: string,
  coin: string,
};

export const setLuxgateLocalWallet = (
  { password, coin }: SetLuxgateLocalWalletParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'localwallet',
    password: password,
    coin: coin
  })
);
