// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgatePasswordParams = {
  passphrase: string,
  password: string
};

export const getLuxgatePassword = (
  { passphrase, password }: GetLuxgatePasswordParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'passphrase',
    passphrase: passphrase,
    password: password
  })
);
