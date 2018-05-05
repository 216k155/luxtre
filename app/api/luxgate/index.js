import { split, get } from 'lodash';
import { action } from 'mobx';
import { getCoinBalance } from './getCoinBalance';

export const LUXGATE_API_HOST = 'localhost';
export const LUXGATE_API_PORT = 7783;

import type {
    GetCoinBalanceResponse
  } from '../common';

export default class LuxApi {

    constructor() {
        if (environment.isTest()) {
          
        }
    }

    async getCoinBalanceOutputs(): Promise<GetCoinBalanceResponse> {
        Logger.debug('LuxApi::getCoinBalanceOutputs called');
        try {
          const response = await getCoinBalance();
          return stringifyData(response);
        } catch (error) {
          Logger.error('LuxApi::getCoinBalanceOutputs error: ' + stringifyError(error));
          throw new GenericApiError();
        }
    }
}