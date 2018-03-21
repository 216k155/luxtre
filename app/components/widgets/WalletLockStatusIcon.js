import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames';
import lockedIcon from '../../assets/images/top-bar/wallet-locked.png';
import styles from './WalletLockStatusIcon.scss';

const messages = defineMessages({
  walletEncrypted: {
    id: 'wallet.encrypted',
    defaultMessage: '!!!Wallet encrypted',
    description: 'Label for the wallet encrypted info overlay on wallet lock status icon.'
  },
});

export default class WalletLockStatusIcon extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.context;
    const componentClasses = classNames([
      styles.component
    ]);
    return (
      <div className={componentClasses}>
        <img className={styles.icon} src={lockedIcon} role="presentation" />
        <div className={styles.info}>
          {intl.formatMessage(messages.walletEncrypted)}
        </div>
      </div>
    );
  }
}
