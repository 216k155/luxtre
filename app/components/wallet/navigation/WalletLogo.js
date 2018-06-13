// @flow
import React, { Component } from 'react';
import SvgInline from 'react-svg-inline';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import styles from './WalletLogo.scss';
import walletframe from '../../../assets/images/wallet-frame.inline.svg';
import luxicon from '../../../assets/images/icon-white.inline.svg';

type Props = {
   amount: string
}

export default class WalletLogo extends Component<Props> {

  render() {
    const {amount} = this.props;
    const bgClasses = classnames([
      styles.background,
      styles.normalIcon
    ]);
    return (
      <div className={styles.container}>
        <SvgInline svg={walletframe} className={bgClasses} />
        <div className={styles.logo} >
          <div><SvgInline svg={luxicon} className={styles.icon} /> </div>
          <div><span className={styles.balance_name} >Your balance </span></div>
          <div><span className={styles.balance_amount} >{amount}</span></div>
        </div>
      </div>
    );
  }
}
