// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type SetLuxgateRemoteWalletParams = {
  password: string,
  coin: string,
  addr: string,
  port: number,
};

export const setLuxgateRemoteWallet = (
  { password, coin, addr, port }: SetLuxgateRemoteWalletParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'remotewallet',
    password: password,
    coin: coin,
    addr: addr,
    port: port,
  })
);
