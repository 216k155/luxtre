// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import SmartContractsWithNavigation from '../../components/wallet/smartcontracts/SmartContractsWithNavigation';
import { buildRoute } from '../../utils/routing';
import { ROUTES } from '../../routes-config';
import type { InjectedContainerProps } from '../../types/injectedPropsType';

type Props = InjectedContainerProps;

@inject('stores', 'actions')
@observer
export default class SmartContractsPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  isActiveScreen = (page: string) => {
    const { app } = this.props.stores;
    const { wallets } = this.props.stores.lux;
    if (!wallets.active) return false;
    const screenRoute = buildRoute(ROUTES.WALLETS.SMARTCONTRACTS.PAGE, { id: wallets.active.id, page });
    return app.currentRoute === screenRoute;
  };

  handleWalletNavItemClick = (page: string) => {
    const { wallets } = this.props.stores.lux;
    if (!wallets.active) return;
    this.props.actions.router.goToRoute.trigger({
      route: ROUTES.WALLETS.SMARTCONTRACTS.PAGE,
      params: { id: wallets.active.id, page },
    });
  };

  render() {
    const { /*masternodes, */wallets } = this.props.stores.lux;
    const { actions } = this.props;
    const activeWallet = wallets.active;

    return (
      <SmartContractsWithNavigation
          isActiveScreen={this.isActiveScreen}
          onWalletNavItemClick={this.handleWalletNavItemClick}
      >
      	{this.props.children}
      </SmartContractsWithNavigation>
    );
  }

}
