// @flow
import LuxApi from './lux/index';
import LocalStorageApi from './localStorage/index';

export type Api = {
  lux: LuxApi,
  localStorage: LocalStorageApi,
};

export const setupApi = (): Api => ({
  lux: new LuxApi(),
  localStorage: new LocalStorageApi(),
});
