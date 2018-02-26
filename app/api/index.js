// @flow
import AdaApi from './ada/index';
import LuxApi from './lux/index';
import LocalStorageApi from './localStorage/index';

export type Api = {
  ada: AdaApi,
  lux: LuxApi,
  localStorage: LocalStorageApi,
};

export const setupApi = (): Api => ({
  ada: new AdaApi(),
  lux: new LuxApi(),
  localStorage: new LocalStorageApi(),
});
