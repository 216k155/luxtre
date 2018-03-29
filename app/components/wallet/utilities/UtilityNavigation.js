// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import styles from './UtilityNavigation.scss';
import WalletNavButton from './UtitliyNavButton';

const messages = defineMessages({
  utilityposcalc: {
    id: 'wallet.navigation.utilityposcalc',
    defaultMessage: '!!!Utility POSCalculator',
    description: 'Label for the "Utility PosCalculator" nav button in the utility poscalculator.'
  },
});

type Props = {
  isActiveNavItem: Function,
  onNavItemClick: Function,
};

@observer
export default class UtilityNavigation extends Component<Props> {

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
            label={intl.formatMessage(messages.utilityposcalc)}
            isActive={isActiveNavItem('poscalculator')}
            onClick={() => onNavItemClick('poscalculator')}
          />
        </div>
      </div>
    );
  }
}
