// @flow
import { ROUTES } from '../../routes-config';
import walletsIcon from '../../assets/images/sidebar/wallet-ic.inline.svg';
import settingsIcon from '../../assets/images/sidebar/settings-ic.inline.svg';
import luxRedemptionIcon from '../../assets/images/sidebar/lux-redemption-ic.inline.svg';

export const CATEGORIES = [
  {
    name: 'WALLETS',
    route: ROUTES.WALLETS.ROOT,
    icon: walletsIcon
  },
  {
    name: 'LUX_REDEMPTION',
    route: ROUTES.LUX_REDEMPTION,
    icon: luxRedemptionIcon
  },
  {
    name: 'SETTINGS',
    route: ROUTES.SETTINGS.ROOT,
    icon: settingsIcon
  }
];
