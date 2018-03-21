// @flow
import localStorage from 'electron-json-storage';
import { set, unset } from 'lodash';
import type { AssuranceModeOption } from '../../types/transactionAssuranceTypes';
import environment from '../../environment';

const networkForLocalStorage = String(environment.NETWORK);
const localStorageKeys = {
  WALLETS: networkForLocalStorage + '-LUX-WALLETS',
};

/**
 * This api layer provides access to the electron local storage
 * for account/wallet properties that are not synced with LUX backend.
 */

export type LuxWalletData = {
  id: string,
  name: string,
  assurance: AssuranceModeOption,
  hasPassword: boolean,
  passwordUpdateDate: ?Date,
};

export type LuxWalletsData = {
  wallets: Array<LuxWalletData>,
};

export const getLuxWalletsData = (): Promise<LuxWalletsData> => new Promise((resolve, reject) => {
  localStorage.get(localStorageKeys.WALLETS, (error, response) => {
    if (error) return reject(error);
    if (!response.wallets) return resolve({ wallets: [] });
    resolve(response.wallets);
  });
});

export const setLuxWalletsData = (
  walletsData: Array<LuxWalletData>
): Promise<void> => new Promise((resolve, reject) => {
  const wallets = {};
  walletsData.forEach(walletData => {
    wallets[walletData.id] = walletData;
  });
  localStorage.set(localStorageKeys.WALLETS, { wallets }, (error) => {
    if (error) return reject(error);
    resolve();
  });
});

export const getLuxWalletData = (
  walletId: string
): Promise<LuxWalletData> => new Promise(async (resolve) => {
  const walletsData = await getLuxWalletsData();
  resolve(walletsData[walletId]);
});

export const setLuxWalletData = (
  walletData: LuxWalletData
): Promise<void> => new Promise(async (resolve, reject) => {
  const walletsData = await getLuxWalletsData();
  set(walletsData, walletData.id, walletData);
  localStorage.set(localStorageKeys.WALLETS, { wallets: walletsData }, (error) => {
    if (error) return reject(error);
    resolve();
  });
});

export const updateLuxWalletData = (
  walletData: {
    id: string,
    name?: string,
    assurance?: AssuranceModeOption,
    hasPassword?: boolean,
    passwordUpdateDate?: ?Date,
  }
): Promise<void> => new Promise(async (resolve, reject) => {
  const walletsData = await getLuxWalletsData();
  const walletId = walletData.id;
  Object.assign(walletsData[walletId], walletData);
  localStorage.set(localStorageKeys.WALLETS, { wallets: walletsData }, (error) => {
    if (error) return reject(error);
    resolve();
  });
});

export const unsetLuxWalletData = (
  walletId: string
): Promise<void> => new Promise(async (resolve, reject) => {
  const walletsData = await getLuxWalletsData();
  unset(walletsData, walletId);
  localStorage.set(localStorageKeys.WALLETS, { wallets: walletsData }, (error) => {
    if (error) return reject(error);
    resolve();
  });
});

export const unsetLuxWalletsData = (): Promise<void> => new Promise((resolve) => {
  localStorage.remove(localStorageKeys.WALLETS, () => {
    resolve();
  });
});