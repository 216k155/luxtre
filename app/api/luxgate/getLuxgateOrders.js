// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgateOrdersParams = {
  base: string,
  rel: string,
};

export const getLuxgateOrders = (
  { base, rel }: GetLuxgateOrdersParams
): Promise<string> => (
  request({
    hostname: LUXGATE_API_HOST,
    method: 'POST',
    port: LUXGATE_API_PORT,
  }, {
    method: 'orderbook',
    base: base,
    rel: rel,
  })
);
