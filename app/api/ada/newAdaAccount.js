// @flow
import type { LuxAccount } from './types';
import { request } from './lib/request';

export type NewLuxAccountQueryParams = {
  passphrase: ?string,
};

export type NewLuxAccountRawBodyParams = {
  accountInitData: {
    caInitMeta: {
      caName: string,
    },
    caInitWId: string,
  }
};

export const newLuxAccount = (
  ca: string,
  pathParams: {},
  queryParams: NewLuxAccountQueryParams,
  rawBodyParams: NewLuxAccountRawBodyParams,
): Promise<LuxAccount> => {
  const { accountInitData } = rawBodyParams;
  return request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/accounts',
    port: 8090,
    ca,
  }, queryParams, accountInitData);
};
