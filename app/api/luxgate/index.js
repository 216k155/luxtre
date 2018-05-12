import { split, get } from 'lodash';
import { action } from 'mobx';
import environment from '../../environment';
import { getLuxgateCoinInfo } from './getLuxgateCoinInfo';
import { getLuxgateOrders } from './getLuxgateOrders';
import { getLuxgateTransactions } from './getLuxgateTransactions';
import { getLuxgateCoinBalanceFromAddress } from './getLuxgateCoinBalanceFromAddress';
import { sendLuxgateCoin } from './sendLuxgateCoin';
import { getLuxgateTradeArray } from './getLuxgateTradeArray';
import { getLuxgatePriceArray } from './getLuxgatePriceArray';

export const LUXGATE_API_HOST = 'localhost';
export const LUXGATE_API_PORT = 9883;
export const LUXGATE_USER_PASSWORD = "fadce34e546424c31c34eeb0d2c9e6505d9f589cdddf3a00d6bd8e1d7105bf15";

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

export type SendCoinRequest = {
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
            const password = LUXGATE_USER_PASSWORD;
            const response = await getLuxgateCoinBalanceFromAddress( {coin, password, address} );
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
            const password = LUXGATE_USER_PASSWORD;
            const response = await getLuxgateCoinInfo({coin, password});
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

    async sendCoin(request: SendCoinRequest): Promise<boolean> {
        Logger.debug('LuxgateApi::sendCoin called');
        const { coin, receiver, amount } = request;
        try {
            const password = LUXGATE_USER_PASSWORD;
            const response = await sendLuxgateCoin({coin, receiver, amount, password});
            if (response !== undefined && response.result === "success")
                return true;
            else
                return false;
        } catch (error) {
            Logger.error('LuxgateApi::sendCoin error: ' + stringifyError(error));
            throw new GenericApiError();
        }
    }

    async getLGOrders(base: string, rel: string): Promise<GetLGOrdersResponse> {
        Logger.debug('LuxgateApi::getLGOrders called');
        try {
            const password = LUXGATE_USER_PASSWORD;
            const response = await getLuxgateOrders({password, base, rel});
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
            const password = LUXGATE_USER_PASSWORD;
            const response = await getLuxgateTransactions({coin, password, address});
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
            const password = LUXGATE_USER_PASSWORD;
            const scale = 60;
            const response = await getLuxgateTradeArray({password, base, rel, scale});
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
            const password = LUXGATE_USER_PASSWORD;
            const scale = 60;
            const response = await getLuxgatePriceArray({password, base, rel, scale});
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