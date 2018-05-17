import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames';
import lockedIcon from '../../assets/images/top-bar/wallet-locked.png';
import styles from './WalletLockStatusIcon.scss';

const messages = defineMessages({
  walletLocked: {
    id: 'wallet.locked',
    defaultMessage: '!!!Wallet encrypted and currently locked',
    description: 'Label for the wallet encrypted info overlay on wallet lock status icon.'
  },
  walletUnlocked: {
    id: 'wallet.unlocked',
    defaultMessage: '!!!Wallet encrypted and currently unlocked',
    description: 'Label for the wallet encrypted info overlay on wallet lock status icon.'
  },
});

type Props = {
  isLocked: boolean,
};

export default class WalletLockStatusIcon extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.context;
    const { isLocked } = this.props;
    const componentClasses = classNames([
      styles.component,
      isLocked ? styles.locked : styles.unlocked,
    ]);
    return (
      <div className={componentClasses}>
        <img className={styles.icon} src={lockedIcon} role="presentation" />
        <div className={styles.info}>
          {isLocked ? intl.formatMessage(messages.walletLocked) : intl.formatMessage(messages.walletUnlocked)}
        </div>
      </div>
    );
  }
}
