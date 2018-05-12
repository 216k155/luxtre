// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateTradeArrayParams = {
  password: string,
  base: string,
  rel: string,
  scale: number
};

export const getLuxgateTradeArray = (
  { password, base, rel, scale }: GetLuxgateTradeArrayParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'listorders',
    password: password,
    base: base,
    rel: rel,
    scale: scale
  })
);
