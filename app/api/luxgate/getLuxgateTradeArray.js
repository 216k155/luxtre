// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateTradeArrayParams = {
  userpass: string,
  base: string,
  rel: string,
  timescale: number
};

export const getLuxgateTradeArray = (
  { userpass, base, rel, timescale }: GetLuxgateTradeArrayParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'orderbook',
    userpass: userpass,
    base: base,
    rel: rel,
    timescale: timescale
  })
);
