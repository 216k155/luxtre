// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import styles from './SmartContractsNavigation.scss';
import SmartContractNavButton from './SmartContractNavButton';

const messages = defineMessages({
  createsmartcontract: {
    id: 'wallet.navigation.createsmartcontract',
    defaultMessage: '!!!Create Smart Contract',
    description: 'Label for the "Create Smart Contract" nav button in the smartcontracts navigation.'
  },
  callsmartcontract: {
    id: 'wallet.navigation.callsmartcontract',
    defaultMessage: '!!!Call Smart Contract',
    description: 'Label for the "Call Smart Contract" nav button in the smartcontracts navigation.'
  },
  sendtosmartcontract: {
    id: 'wallet.navigation.sendtosmartcontract',
    defaultMessage: '!!!Send to Smart Contract',
    description: 'Label for the "Send to Smart Contract" nav button in the smartcontracts navigation.'
  },
  solcompiler: {
    id: 'wallet.navigation.solcompiler',
    defaultMessage: '!!!Solidity Compiler',
    description: 'Label for the "Solidity Compiler" nav button in the smartcontracts navigation.'
  }
});

type Props = {
  isActiveNavItem: Function,
  onNavItemClick: Function,
};

@observer
export default class SmartContractsNavigation extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { isActiveNavItem, onNavItemClick} = this.props;
    const { intl } = this.context;
    return (
      <div className={styles.component}>
        <div className={styles.navItem}>
          <SmartContractNavButton
            label={intl.formatMessage(messages.createsmartcontract)}
            isActive={isActiveNavItem('createsmartcontract')}
            onClick={() => onNavItemClick('createsmartcontract')}
          />
        </div>

        <div className={styles.navItem}>
          <SmartContractNavButton
            label={intl.formatMessage(messages.callsmartcontract)}
            isActive={isActiveNavItem('callsmartcontract')}
            onClick={() => onNavItemClick('callsmartcontract')}
          />
        </div>

        <div className={styles.navItem}>
          <SmartContractNavButton
            label={intl.formatMessage(messages.sendtosmartcontract)}
            isActive={isActiveNavItem('sendtosmartcontract')}
            onClick={() => onNavItemClick('sendtosmartcontract')}
          />
        </div>

        <div className={styles.navItem}>
          <SmartContractNavButton
            label={intl.formatMessage(messages.solcompiler)}
            isActive={isActiveNavItem('solcompiler')}
            onClick={() => onNavItemClick('solcompiler')}
          />
        </div>
       </div>
    );
  }
}
