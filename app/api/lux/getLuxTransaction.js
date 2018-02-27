// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT } from './index';
import type { LuxTransaction } from './types';

export type GetLuxTransactionByHashParams = {
  txHash: string
};

export const getLuxTransactionByHash = async (
  { txHash }: GetLuxTransactionByHashParams
): Promise<LuxTransaction> => {
  const response = await request({
    hostname: LUX_API_HOST,
    method: 'POST',
    port: LUX_API_PORT,
    auth: LUX_API_USER + ':' + LUX_API_PWD
  }, {
    jsonrpc: '2.0',
    method: 'gettransaction',
    params: [txHash]
  });

  const luxTransaction = {
    account: response.details[0].account,
    address: response.details[0].address,
    category: response.details[0].category,
    amount: response.details[0].amount,
    fee: response.details[0].fee,
    confirmations: response.confirmations,
    txid: response.txid,
    //nonce: string,
    blockhash: response.blockhash,
    //blockNumber: LuxBlockNumber,
    blockindex: response.blockindex,
    blocktime: response.blocktime
  };
  return luxTransaction;
};