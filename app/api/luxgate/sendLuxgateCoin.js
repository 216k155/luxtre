// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type SendLuxgateCoinParams = {
  coin: string,
  receiver: string,
  amount: number,
  password: string
};

export const sendLuxgateCoin = (
  { coin, receiver, amount, password }: SendLuxgateCoinParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'sendtransaction',
    coin: coin,
    receiver: receiver,
    amount: amount,
    password: password
  })
);
