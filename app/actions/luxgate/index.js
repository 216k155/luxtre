// @flow
import LoginInfoActions from './logininfo-actions';
import CoinInfoActions from './coininfo-actions';
import MarketInfoActions from './marketinfo-actions';

export type LuxgateActionsMap = {
  loginInfo: LoginInfoActions,
  coinInfo: CoinInfoActions,
  marketInfo: MarketInfoActions,
};

const luxgateActionsMap: LuxgateActionsMap = {
  loginInfo: new LoginInfoActions(),
  coinInfo: new CoinInfoActions(),
  marketInfo: new MarketInfoActions(),
};

export default luxgateActionsMap;
