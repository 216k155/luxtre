// @flow
import CoinInfoActions from './coininfo-actions';

export type LuxgateActionsMap = {
  coinInfo: CoinInfoActions,
};

const luxgateActionsMap: LuxgateActionsMap = {
  coinInfo: new CoinInfoActions(),
};

export default luxgateActionsMap;
