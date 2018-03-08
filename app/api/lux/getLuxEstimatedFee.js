// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxFee } from './types';

export type GetLuxEstimatedFeeParams = {
  blocks: number
};

export const getLuxEstimatedFee = (
  { blocks }: GetLuxEstimatedFeeParams
): Promise<LuxFee> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'estimatefee',
    params: [
      blocks
    ]
  })
);
