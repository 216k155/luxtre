// @flow
import BigNumber from 'bignumber.js';
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { SendToLuxContractOutput } from './types';

export type SendToLuxContractParams = {
  contractaddress: string,
  datahex: string,
  amount: number,
  gasLimit: number,
  gasPrice: number,
  senderaddress: string
};

export const sendToLuxContract = (
  { contractaddress, datahex, amount, gasLimit, gasPrice, senderaddress }: SendToLuxContractParams
): Promise<SendToLuxContractOutput> =>
  request(
    {
      hostname: LUX_API_HOST,
      method: 'POST',
      port: LUX_API_PORT,
      auth: LUX_API_USER + ':' + LUX_API_PWD
    },
    {
      jsonrpc: '2.0',
      method: 'sendtocontract',
      params: [contractaddress, datahex, amount, gasLimit, gasPrice, senderaddress]
    }
  );
