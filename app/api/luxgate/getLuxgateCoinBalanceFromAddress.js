// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetBalanceFromAddressParams = {
  coin: string,
  userpass: string,
  address: string
};

export const getLuxgateCoinBalanceFromAddress = (
  { coin, userpass, address }: GetBalanceFromAddressParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'balance',
    coin: coin,
    userpass: userpass,
    address: address
  })
);
