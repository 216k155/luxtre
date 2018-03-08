// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';
import type { LuxTransaction } from './types';

export type GetLuxTransactionByHashParams = {
  txHash: string
};

export const getLuxTransactionByHash = async ({
  txHash
}: GetLuxTransactionByHashParams): Promise<LuxTransaction> => {
  const response = await request(
    {
      hostname: LUX_API_HOST,
      method: 'POST',
      port: LUX_API_PORT,
      auth: LUX_API_USER + ':' + LUX_API_PWD
    },
    {
      jsonrpc: '2.0',
      method: 'gettransaction',
      params: [txHash]
    }
  );

  /*

￼
{
    "amount" : -1.00000000,
    "fee" : -0.00003780,
    "confirmations" : 1,
    "bcconfirmations" : 1,
    "blockhash" : "e170158397d87be9a89d3a42be5a542e092d00f772d0f2f5b89bd080b896452a",
    "blockindex" : 2,
    "blocktime" : 1520201555,
    "txid" : "f284075b7181cf6ced3a38dcf3d7863d7c562504ede82c3c86c588621686614b",
    "walletconflicts" : [
    ],
    "time" : 1520201476,
    "timereceived" : 1520201476,
    "details" : [
        {
            "account" : "",
            "address" : "LhDvAqH9DoHFQRoxa8KbmE7uJS57Q4Wf98",
            "category" : "send",
            "amount" : -1.00000000,
            "vout" : 0,
            "fee" : -0.00003780
        }
    ],
    "hex" : "01000000000000000248ba5188551f05ba9e66b96beb918b88b3b29a1214a32ed67f53c39d000cbeea000000006b4830450221008e58d09e7a919f705edc2a32fd1cdbb2837c56e7de59b55f4dd8eb224cb07ca502205be675a114c531bf50388c0cea025c3d862cccf9638dfda55647d4e8c21a948d012103d8ca0c516828d9b7ee871193fd422e1ce58f2a8ae8d43369342ec2fc61fc4b75ffffffff195a7a32683c24f68522a39d54af3561a15ced847db59234fd1a4f3472102b1f000000006b483045022100af885fbf428c73cfd64502145d41e5cbee168189622fd206f6fbebab57c8384d0220220d2edc71af0122d7d67c3642285b51d611dcc91b394858cdb7dff2e434b979012103d8ca0c516828d9b7ee871193fd422e1ce58f2a8ae8d43369342ec2fc61fc4b75ffffffff0200e1f505000000001976a914f15105324eed5f3a49d93f169737b9b67732a4dd88ac3cd2f505000000001976a9143a269172cad350c1a31dd4e39f0961834d00de3088ac00000000"
  }

  */

  const luxTransaction: LuxTransaction = {
    account: response.details[0].account,
    address: response.details[0].address,
    category: response.details[0].category,
    amount: response.details[0].amount,
    fee: response.details[0].fee,
    confirmations: response.confirmations,
    bcconfirmations: response.bcconfirmations,
    txid: response.txid,
    // nonce: string,
    blockhash: response.blockhash,
    // blockNumber: LuxBlockNumber,
    blockindex: response.blockindex,
    blocktime: response.blocktime
  };
  return luxTransaction;
};
