// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxGas } from './types';

export type GetLuxEstimatedGasParams = {
  ca: string,
  from: string,
  to: string,
  value: BigNumber, // QUANTITY in WEI with base 10
  gasPrice: BigNumber, // QUANTITY in WEI with base 10
};

export const getLuxEstimatedGas = (
  { ca, from, to, value, gasPrice }: GetLuxEstimatedGasParams
): Promise<LuxGas> => (
  request({
    hostname: LUX_API_HOST,
    method: 'POST',
    path: '/',
    port: LUX_API_PORT,
    ca,
  }, {
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [{
      from,
      to,
      // Convert quantities to HEX for the LUX api
      value: new BigNumber(value).toString(16),
      gasPrice: new BigNumber(gasPrice).toString(16),
    }]
  })
);
