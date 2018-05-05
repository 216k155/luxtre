import { split, get } from 'lodash';
import { action } from 'mobx';
import environment from '../../environment';
import { getCoinInfo } from './getCoinInfo';

export const LUXGATE_API_HOST = 'localhost';
export const LUXGATE_API_PORT = 7783;

import type {
    GetCoinInfoResponse
  } from '../common';

export default class LuxApi {

    constructor() {
        if (environment.isTest()) {
          
        }
    }

    async getCoinInfoOutputs(): Promise<GetCoinInfoResponse> {
        Logger.debug('LuxApi::getCoinInfoOutputs called');
        try {
          const response = await getCoinInfo();
          return stringifyData(response);
        } catch (error) {
          Logger.error('LuxApi::getCoinInfoOutputs error: ' + stringifyError(error));
          throw new GenericApiError();
        }
    }
}