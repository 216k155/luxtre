// @flow
import BigNumber from 'bignumber.js';

export type LuxgateAccountNewPhraseResponse = Array<string>;
export type LuxgateSwapOutput = {
    result: string,
    error: string,
    pending: boolean
}
export type CoinInfo = {
    coin: string,
    balance: number,
    smartaddress: string,
    height: number,
    status: string
}

export type LuxgateCoinInfo = {
  result: string,
  coin: CoinInfo
}