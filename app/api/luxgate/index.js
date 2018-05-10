import { split, get } from 'lodash';
import { action } from 'mobx';
import environment from '../../environment';
import { getLuxgateCoinInfo } from './getLuxgateCoinInfo';
import { getLuxgateOrders } from './getLuxgateOrders';
import { getLuxgateTransactions } from './getLuxgateTransactions';
import { getLuxgateCoinBalanceFromAddress } from './getLuxgateCoinBalanceFromAddress';
import { withdrawLuxgateCoin } from './withdrawLuxgateCoin';
import { getLuxgateTradeArray } from './getLuxgateTradeArray';
import { getLuxgatePriceArray } from './getLuxgatePriceArray';

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
    WalletAlreadyRestoredError
  } from '../common';

import type {
    GetCoinInfoResponse,
    GetCoinBalanceResponse,
    GetLGOrdersResponse,
    GetLGTransactionsResponse,
    GetLGTradeArrayResponse,
    GetLGPriceArrayResponse
  } from '../common';

export type WithdrawRequest = {
coin: string,
address: string,
amount: string,
};

export default class LuxApi {

    constructor() {
        if (environment.isTest()) {
          
        }
    }

    async getCoinBalanace(coin: string, address: string): Promise<GetCoinBalanceResponse> {
        Logger.debug('LuxgateApi::getCoinBalanace called');
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
            Logger.error('LuxgateApi::getCoinBalanace error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }   

    async getCoinInfo(coin: string): Promise<GetCoinInfoResponse> {
        Logger.debug('LuxgateApi::getCoinInfo called');
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
            Logger.error('LuxgateApi::getCoinInfo error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }

    async withdraw(request: WithdrawRequest): Promise<boolean> {
        Logger.debug('LuxgateApi::withdraw called');
        const { coin, address, amount } = request;
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            let outputs = [];
            let output = {};
            output[address] = amount;
            outputs.push(output);
            const response = await withdrawLuxgateCoin({coin, outputs, userpass});
            if (response !== undefined && response.result === "success")
                return true;
            else
                return false;
        } catch (error) {
            Logger.error('LuxgateApi::withdraw error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }

    async getLGOrders(base: string, rel: string): Promise<GetLGOrdersResponse> {
        Logger.debug('LuxgateApi::getLGOrders called');
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            const response = await getLuxgateOrders({userpass, base, rel});
            if (response !== undefined)
            {
                return stringifyData(response);
            }
            else
                return "";
        } catch (error) {
            Logger.error('LuxgateApi::getLGOrders error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }

    async getLGTransactions(coin: string, address: string): Promise<GetLGTransactionsResponse> {
        Logger.debug('LuxgateApi::getLGTransactions called');
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            const response = await getLuxgateTransactions({coin, userpass, address});
            if (response !== undefined && !response.error)
            {
                return stringifyData(response);
            }
            else
                return "";
        } catch (error) {
            Logger.error('LuxgateApi::getLGTransactions error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }
    async getLGTradeArray(base: string, rel: string): Promise<GetLGTradeArrayResponse> {
        Logger.debug('LuxgateApi::getLGTradeArray called');
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            const timeline = 60;
            const response = await getLuxgateTradeArray({userpass, base, rel, timeline});
            if (response !== undefined)
            {
                return stringifyData(response);
            }
            else
                return "";
        } catch (error) {
            Logger.error('LuxgateApi::getLGTradeArray error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }
    async getLGPriceArray(base: string, rel: string): Promise<GetLGPriceArrayResponse> {
        Logger.debug('LuxgateApi::getLGPriceArray called');
        try {
            const userpass = "610fb5f228b6857fa91ada725033979a2a5e327b9a68ee6c59300d9d31c84718";
            const timeline = 60;
            const response = await getLuxgatePriceArray({userpass, base, rel, timeline});
            if (response !== undefined)
            {
                return stringifyData(response);
            }
            else
                return "";
        } catch (error) {
            Logger.error('LuxgateApi::getLGPriceArray error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }
}