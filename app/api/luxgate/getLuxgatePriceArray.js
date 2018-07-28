// @flow
import { request } from './lib/request';
import { LUXGATE_API_HOST, LUXGATE_API_PORT } from './index';

export type GetLuxgatePriceArrayParams = {
  password: string,
  base: string,
  rel: string,
  scale: number
};

export const getLuxgatePriceArray = ({
  password,
  base,
  rel,
  scale
}: GetLuxgatePriceArrayParams): Promise<string> =>
  request(
    {
      hostname: LUXGATE_API_HOST,
      method: 'POST',
      port: LUXGATE_API_PORT
    },
    {
      method: 'listtrades',
      password,
      base,
      rel,
      scale
    }
  );
