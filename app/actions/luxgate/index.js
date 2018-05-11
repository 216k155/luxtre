// @flow
import CoinInfoActions from './coininfo-actions';
import MarketInfoActions from './marketinfo-actions';

export type LuxgateActionsMap = {
  coinInfo: CoinInfoActions,
  marketInfo: MarketInfoActions,
};

const luxgateActionsMap: LuxgateActionsMap = {
  coinInfo: new CoinInfoActions(),
  marketInfo: new MarketInfoActions(),
};

export default luxgateActionsMap;
