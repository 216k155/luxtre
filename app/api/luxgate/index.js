import { split, get } from 'lodash';
import { action } from 'mobx';
import environment from '../../environment';
import { getLuxgateCoinInfo } from './getLuxgateCoinInfo';
import { getLuxgateCoinBalanceFromAddress } from './getLuxgateCoinBalanceFromAddress';

export const LUXGATE_API_HOST = 'localhost';
export const LUXGATE_API_PORT = 7783;

import { 
    Logger, 
    stringifyData, 
    stringifyError
  } from '../../utils/logging';

import {
    GenericApiError,
    IncorrectWalletPasswordError,
    WalletAlreadyRestoredError,
  } from '../common';

import type {
    GetCoinInfoResponse,
    GetCoinBalanceResponse
  } from '../common';

export default class LuxApi {

    constructor() {
        if (environment.isTest()) {
          
        }
    }

    async getCoinBalanace(coin: string, address: string): Promise<GetCoinInfoResponse> {
        Logger.debug('LuxApi::getCoinInfo called');
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            const response = await getLuxgateCoinBalanceFromAddress( {coin, userpass, address} );
            if (response !== undefined && response.result === "success")
            {
                return response.balance;
            }
            else
                return 0;
        } catch (error) {
            Logger.error('LuxApi::getCoinInfo error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }   

    async getCoinInfo(coin: string): Promise<GetCoinInfoResponse> {
        Logger.debug('LuxApi::getCoinInfo called');
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            const response = await getLuxgateCoinInfo({coin, userpass});
            if (response !== undefined && response.result === "success")
            {
                return stringifyData(response.coin);
            }
            else
                return "";
        } catch (error) {
            Logger.error('LuxApi::getCoinInfo error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }
}