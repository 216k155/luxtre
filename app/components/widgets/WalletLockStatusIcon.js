import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames';
import lockedIcon from '../../assets/images/top-bar/wallet-locked.png';
import loginIcon from '../../assets/images/top-bar/login.png';
import logoutIcon from '../../assets/images/top-bar/logout.png';
import styles from './WalletLockStatusIcon.scss';
import LuxgateLoginDialog from '../exchange/LuxgateLoginDialog';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';

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
  isShowingLuxtre: boolean,
  openDialogAction: Function,
};

export default class WalletLockStatusIcon extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  onClickLoginIcon() {
		this.props.openDialogAction({dialog: LuxgateLoginDialog});
  }
  
  render() {
    const { intl } = this.context;
    const { isLocked, isShowingLuxtre, openDialogAction } = this.props;
    const componentClasses = classNames([
      styles.component,
      isLocked ? styles.locked : styles.unlocked,
      isShowingLuxtre ? styles.right68 : styles.right28,
    ]);
    return (
      <div className={componentClasses}>
        {isShowingLuxtre ? ( 
          <div>
            <img className={styles.icon} src={lockedIcon} role="presentation" />
            <div className={styles.info}>
              {isLocked ? intl.formatMessage(messages.walletLocked) : intl.formatMessage(messages.walletUnlocked)}
            </div>
          </div>
         ) : (
          <button className={styles.loginIcon} onClick={() => this.onClickLoginIcon()}> 
            <img className={styles.icon} src={loginIcon} role="presentation" />   
          </button>
        )}
      </div>
    );
  }
}
