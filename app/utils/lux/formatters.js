// @flow
import BigNumber from 'bignumber.js';
import { DECIMAL_PLACES_IN_LUX } from '../../config/numbersConfig';

export const formattedWalletAmount = (
  amount: BigNumber,
  withCurrency: boolean = true,
) => {
  let formattedAmount = amount.toFormat(DECIMAL_PLACES_IN_LUX);

  if (withCurrency) formattedAmount += ' LUX';

  return formattedAmount.toString();
};
