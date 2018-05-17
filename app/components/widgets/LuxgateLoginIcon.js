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
  openDialogAction: Function,
};

export default class LuxgateLoginIcon extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  onClickLoginIcon() {
		this.props.openDialogAction({dialog: LuxgateLoginDialog});
  }
  
  render() {
    const { intl } = this.context;
    const componentClasses = classNames([
      styles.component,
    ]);
    const tooltip = intl.formatMessage(messages.LuxgateTopbarLoginTooltip);

    return (
      <div className={componentClasses}>
        <button className={styles.loginIcon} title={tooltip}  onClick={() => this.onClickLoginIcon()}> 
          <img className={styles.icon} src={loginIcon} role="presentation" />   
        </button>
      </div>
    );
  }
}
