// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import MainLayout from '../MainLayout';
import WalletWithNavigation from '../../components/wallet/layouts/WalletWithNavigation';
import ExchangePage from '../../components/exchange/ExchangePage';
import LoadingSpinner from '../../components/widgets/LoadingSpinner';
import LuxRedemptionSuccessOverlay from '../../components/wallet/lux-redemption/LuxRedemptionSuccessOverlay';
import { buildRoute } from '../../utils/routing';
import { ROUTES } from '../../routes-config';
import type { InjectedContainerProps } from '../../types/injectedPropsType';
import { DECIMAL_PLACES_IN_LUX } from '../../config/numbersConfig';

type Props = InjectedContainerProps;

@inject('stores', 'actions') @observer
export default class Wallet extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  isActiveScreen = (page: string) => {
    const { app } = this.props.stores;
    const { wallets } = this.props.stores.lux;
    if (!wallets.active) return false;
    const screenRoute = buildRoute(ROUTES.WALLETS.PAGE, { id: wallets.active.id, page });
    return app.currentRoute === screenRoute;
  };

  handleWalletNavItemClick = (page: string) => {
    const { wallets } = this.props.stores.lux;
    if (!wallets.active) return;
    this.props.actions.router.goToRoute.trigger({
      route: ROUTES.WALLETS.PAGE,
      params: { id: wallets.active.id, page },
    });
  };

  render() {
    const { sidebar } = this.props.stores;
    const { wallets, luxRedemption } = this.props.stores.lux;
    const { actions } = this.props;
    const { showLuxRedemptionSuccessMessage, amountRedeemed } = luxRedemption;
    const {isShowingSubMenus} = sidebar;
    if (!wallets.active) return <MainLayout><LoadingSpinner /></MainLayout>;

    return (
      <MainLayout>
        {isShowingSubMenus ?
          <WalletWithNavigation
            isActiveScreen={this.isActiveScreen}
            onWalletNavItemClick={this.handleWalletNavItemClick}
            amount={wallets.active.amount.toFormat(DECIMAL_PLACES_IN_LUX)}
          >
            {this.props.children}
          </WalletWithNavigation>
          :
          <ExchangePage>
            {/*code Exchange UI here */}
          </ExchangePage>  
        }
      </MainLayout>
    );
  }
}
