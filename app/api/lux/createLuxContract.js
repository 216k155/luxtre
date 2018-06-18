// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxContractInfo } from './types';

export type CreateLuxContractParams = {
  bytecode: string,
  gasLimit: number,
  gasPrice: number,
  senderaddress: string
};

export const createLuxContract = (
  { bytecode, gasLimit, gasPrice, senderaddress }: CreateLuxContractParams
): Promise<LuxContractInfo> =>
  request(
    {
      hostname: LUX_API_HOST,
      method: 'POST',
      port: LUX_API_PORT,
      auth: LUX_API_USER + ':' + LUX_API_PWD
    },
    {
      jsonrpc: '2.0',
      method: 'createcontract',
      params: [bytecode, gasLimit, gasPrice, senderaddress]
    }
  );
