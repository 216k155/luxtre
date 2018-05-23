// @flow
import React, { Component } from 'react';
import SvgInline from 'react-svg-inline';
import type { Node } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import Wallet from '../../domain/Wallet';
import styles from './TopBar.scss';
import resolver from '../../utils/imports';
import { matchRoute } from '../../utils/routing';
import { ROUTES } from '../../routes-config';

const { formattedWalletAmount } = resolver('utils/formatters');

type Props = {
  onToggleSwitchLuxgate?: ?Function,
  children?: ?Node,
  activeWallet?: ?Wallet,
  currentRoute: string,
  showSubMenus?: ?boolean,
};

@observer
export default class TopBar extends Component<Props> {

  render() {
    const { onToggleSwitchLuxgate, activeWallet, currentRoute, showSubMenus } = this.props;
    const walletRoutesMatch = matchRoute(`${ROUTES.WALLETS.ROOT}/:id(*page)`, currentRoute);
    const showWalletInfo = walletRoutesMatch && activeWallet != null;
    const topBarStyles = classNames([
      styles.topBar,
      showSubMenus ? styles.withoutExchange : styles.withExchange
    ]);

    return (
      <header className={topBarStyles}>
        {this.props.children}
      </header>
    );
  }
}
