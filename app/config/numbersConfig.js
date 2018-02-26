import BigNumber from 'bignumber.js';

export const LOVELACES_PER_ADA = 1000000;
export const WEI_PER_LUX = 1000000000000000000;
export const MAX_INTEGER_PLACES_IN_ADA = 11;
export const DECIMAL_PLACES_IN_ADA = 6;
export const DECIMAL_PLACES_IN_LUX = 18;
export const LUX_DEFAULT_GAS_PRICE = new BigNumber(10).pow(10).times(2);
