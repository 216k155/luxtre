import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames';
import lockedIcon from '../../assets/images/top-bar/wallet-locked.png';
import loginIcon from '../../assets/images/top-bar/login.png';
import logoutIcon from '../../assets/images/top-bar/logout.png';
import styles from './LuxgateLoginIcon.scss';
import LuxgateLoginDialog from '../exchange/LuxgateLoginDialog';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';

const messages = defineMessages({
  LuxgateTopbarLoginTooltip: {
    id: 'luxgate.Toopbar.Login.Tooltip',
    defaultMessage: '!!!Login',
    description: 'Tooltip for Login Icon on Luxgate Toopbar.'
  },
  LuxgateTopbarLogoutTooltip: {
    id: 'luxgate.Toopbar.Logout.Tooltip',
    defaultMessage: '!!!Logout',
    description: 'Tooltip for Logout Icon on Luxgate Toopbar.'
  },
});

type Props = {
  isLogined: boolean,
  onLogout: Function,
  openDialogAction: Function,
};

export default class LuxgateLoginIcon extends Component<Props> {

  static defaultProps = {
    isLogined: false,
  };

  static contextTypes = {
    intl: intlShape.isRequired
  };

  onClickLoginIcon() {
    if (this.props.isLogined)
      this.props.onLogout();
    else
      this.props.openDialogAction({dialog: LuxgateLoginDialog});
  }

  render() {
    const { isLogined } = this.props;
    const { intl } = this.context;
    const componentClasses = classNames([
      styles.component,
    ]);

    return (
      <div className={componentClasses}>
        <button 
          className={styles.loginIcon} 
          title={!isLogined? intl.formatMessage(messages.LuxgateTopbarLoginTooltip) : intl.formatMessage(messages.LuxgateTopbarLogoutTooltip)}  
          onClick={() => this.onClickLoginIcon()}
          > 
            <img className={styles.icon} src={!isLogined? loginIcon : logoutIcon } role="presentation" />   
        </button>
      </div>
    );
  }
}
