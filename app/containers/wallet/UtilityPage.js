// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import UtilityWithNavigation from '../../components/wallet/utilities/UtilityWithNavigation';
import { buildRoute } from '../../utils/routing';
import { ROUTES } from '../../routes-config';
import type { InjectedContainerProps } from '../../types/injectedPropsType';

type Props = InjectedContainerProps;

@inject('stores', 'actions')
@observer
export default class UtilityPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  isActiveScreen = (page: string) => {
    const { app } = this.props.stores;
    const { wallets } = this.props.stores.lux;
    if (!wallets.active) return false;
    const screenRoute = buildRoute(ROUTES.WALLETS.UTILITIES.PAGE, { id: wallets.active.id, page });
    return app.currentRoute === screenRoute;
  };

  handleWalletNavItemClick = (page: string) => {
    const { wallets } = this.props.stores.lux;
    if (!wallets.active) return;
    this.props.actions.router.goToRoute.trigger({
      route: ROUTES.WALLETS.UTILITIES.PAGE,
      params: { id: wallets.active.id, page },
    });
  };

  render() {
    const { wallets } = this.props.stores.lux;
    const { actions } = this.props;
    const activeWallet = wallets.active;

    return (
      <UtilityWithNavigation
          isActiveScreen={this.isActiveScreen}
          onWalletNavItemClick={this.handleWalletNavItemClick}
      >
      	{this.props.children}
      </UtilityWithNavigation>
    );
  }

}
