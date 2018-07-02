// @flow
import React, { Component } from 'react';
import SvgInline from 'react-svg-inline';
import type { Node } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import Wallet from '../../domain/Wallet';
import menuIconClosed from '../../assets/images/exchange-closed.inline.svg';
import menuIconOpened from '../../assets/images/exchange-opened.inline.svg';
import styles from './TopBar.scss';
import resolver from '../../utils/imports';
import { matchRoute } from '../../utils/routing';
import { ROUTES } from '../../routes-config';

const { formattedWalletAmount } = resolver('utils/formatters');

type Props = {
  onSwitchLuxgate?: ?Function,
  children?: ?Node,
  isShowingLuxtre?: ?boolean,
};

@observer
export default class TopBar extends Component<Props> {

  render() {
    const { onSwitchLuxgate, isShowingLuxtre } = this.props;

    const topBarStyles = classNames([
      styles.topBar,
      (isShowingLuxtre == undefined || isShowingLuxtre == true) ? styles.withoutExchange : styles.withExchange
    ]);


    const switchToggleIcon = (
      <SvgInline
        svg={isShowingLuxtre ? menuIconOpened : menuIconClosed}
        className={styles.sidebarIcon}
      />
    );

    return (
      <header className={topBarStyles}>
        {/*isShowingLuxtre != undefined ? (
          <button className={styles.leftIcon} onClick={onSwitchLuxgate}>
            {switchToggleIcon}
          </button>
        ) : (null)*/}

        {/*<button className={styles.leftIcon} onClick={onSwitchLuxgate}>
          {switchToggleIcon}
        </button>*/}
        {this.props.children}
      </header>
    );
  }
}
