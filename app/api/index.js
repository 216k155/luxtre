// @flow
import LuxApi from './lux/index';
import LuxgateApi from './luxgate/index';
import LocalStorageApi from './localStorage/index';

export type Api = {
  lux: LuxApi,
  luxgate, LuxgateApi,
  localStorage: LocalStorageApi,
};

export const setupApi = (): Api => ({
  lux: new LuxApi(),
  luxgate: new LuxgateApi(),
  localStorage: new LocalStorageApi(),
});
