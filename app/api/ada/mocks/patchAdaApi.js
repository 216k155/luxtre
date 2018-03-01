import BigNumber from 'bignumber.js';
import { Logger } from '../../../utils/logging';
import { RedeemLuxError } from '../errors';
import LuxApi from '../index';
import type {
  RedeemPaperVendedLuxRequest,
  RedeemLuxRequest
} from '../index';

// ========== LOGGING =========

const stringifyData = (data) => JSON.stringify(data, null, 2);

export default (api: LuxApi) => {
  // Since we cannot test lux redemption in dev mode, just resolve the requests
  api.redeemLux = async (request: RedeemLuxRequest) => {
    Logger.debug('LuxApi::redeemLux (PATCHED) called: ' + stringifyData(request));
    const { redemptionCode } = request;
    const isValidRedemptionCode = await api.isValidRedemptionKey(redemptionCode);
    if (!isValidRedemptionCode) {
      Logger.debug('LuxApi::redeemLux failed: not a valid redemption key!');
      throw new RedeemLuxError();
    }
    return { amount: new BigNumber(1000) };
  };

  api.redeemPaperVendedLux = async(request: RedeemPaperVendedLuxRequest) => {
    Logger.debug('LuxApi::redeemPaperVendedLux (PATCHED) called: ' + stringifyData(request));
    const { shieldedRedemptionKey, mnemonics } = request;
    const isValidKey = await api.isValidPaperVendRedemptionKey(shieldedRedemptionKey);
    const isValidMnemonic = await api.isValidRedemptionMnemonic(mnemonics);
    if (!isValidKey) Logger.debug('LuxApi::redeemPaperVendedLux failed: not a valid redemption key!');
    if (!isValidMnemonic) Logger.debug('LuxApi::redeemPaperVendedLux failed: not a valid mnemonic!');
    if (!isValidKey || !isValidMnemonic) {
      throw new RedeemLuxError();
    }
    return { amount: new BigNumber(1000) };
  };
};
