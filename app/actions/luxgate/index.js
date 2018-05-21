// @flow
import LoginInfoActions from './logininfo-actions';
import SettingInfoActions from './settinginfo-actions';
import CoinInfoActions from './coininfo-actions';
import MarketInfoActions from './marketinfo-actions';

export type LuxgateActionsMap = {
  loginInfo: LoginInfoActions,
  settingInfo: SettingInfoActions,
  coinInfo: CoinInfoActions,
  marketInfo: MarketInfoActions,
};

const luxgateActionsMap: LuxgateActionsMap = {
  loginInfo: new LoginInfoActions(),
  settingInfo: new SettingInfoActions(),
  coinInfo: new CoinInfoActions(),
  marketInfo: new MarketInfoActions(),
};

export default luxgateActionsMap;
