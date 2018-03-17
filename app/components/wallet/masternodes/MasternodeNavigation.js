// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import styles from './MasternodeNavigation.scss';
import WalletNavButton from './MasternodeNavButton';

const messages = defineMessages({
  masternodesnet: {
    id: 'wallet.navigation.masternodesnet',
    defaultMessage: '!!!Lux Masternodes Network',
    description: 'Label for the "Lux Masternodes Network" nav button in the masternode navigation.'
  },
  mymasternode: {
    id: 'wallet.navigation.mymasternode',
    defaultMessage: '!!!My Lux Masternode',
    description: 'Label for the "My Lux Masternode" nav button in the masternode navigation.'
  },
});

type Props = {
  isActiveNavItem: Function,
  onNavItemClick: Function,
};

@observer
export default class MasternodeNavigation extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { isActiveNavItem, onNavItemClick} = this.props;
    const { intl } = this.context;
    return (
      <div className={styles.component}>
        <div className={styles.navItem}>
          <WalletNavButton
            className="summary"
            label={intl.formatMessage(messages.masternodesnet)}
            isActive={isActiveNavItem('masternodesnet')}
            onClick={() => onNavItemClick('masternodesnet')}
          />
        </div>

        <div className={styles.navItem}>
          <WalletNavButton
            className="send"
            label={intl.formatMessage(messages.mymasternode)}
            isActive={isActiveNavItem('mymasternode')}
            onClick={() => onNavItemClick('mymasternode')}
          />
        </div>
       </div>
    );
  }
}
