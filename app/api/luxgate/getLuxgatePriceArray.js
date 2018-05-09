// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgatePriceArrayParams = {
  userpass: string,
  base: string,
  rel: string,
  timescale: number
};

export const getLuxgatePriceArray = (
  { userpass, base, rel, timescale }: GetLuxgatePriceArrayParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'tradesarray',
    userpass: userpass,
    base: base,
    rel: rel,
    timescale: timescale
  })
);
