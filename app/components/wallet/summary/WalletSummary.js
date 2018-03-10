// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import SvgInline from 'react-svg-inline';
import luxSymbolBig from '../../../assets/images/lux-logo.inline.svg';
import luxSymbolSmallest from '../../../assets/images/lux-logo.inline.svg';
import BorderedBox from '../../widgets/BorderedBox';
import { DECIMAL_PLACES_IN_LUX } from '../../../config/numbersConfig';
import type { UnconfirmedAmount } from '../../../types/unconfirmedAmountType';
import styles from './WalletSummary.scss';

const messages = defineMessages({
  pendingOutgoingConfirmationLabel: {
    id: 'wallet.summary.page.pendingOutgoingConfirmationLabel',
    defaultMessage: '!!!Outgoing pending confirmation',
    description: '"Outgoing pending confirmation" label on Wallet summary page'
  },
  pendingIncomingConfirmationLabel: {
    id: 'wallet.summary.page.pendingIncomingConfirmationLabel',
    defaultMessage: '!!!Incoming pending confirmation',
    description: '"Incoming pending confirmation" label on Wallet summary page'
  },
  transactionsLabel: {
    id: 'wallet.summary.page.transactionsLabel',
    defaultMessage: '!!!Number of transactions',
    description: '"Number of transactions" label on Wallet summary page'
  }
});

type Props = {
  walletName: string,
  amount: string,
  numberOfTransactions: number,
  pendingAmount: UnconfirmedAmount,
  isLoadingTransactions: boolean,
};

@observer
export default class WalletSummary extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const {
      walletName,
      amount,
      pendingAmount,
      numberOfTransactions,
      isLoadingTransactions
    } = this.props;
    const { intl } = this.context;
    return (
      <div className={styles.component}>
	<div className={styles.categoryTitle}>
          Summary
        </div>
        <BorderedBox>
          <div className={styles.walletName}>{walletName}</div>
          <div className={styles.walletAmount}>
            {amount}
            <SvgInline svg={luxSymbolBig} className={styles.currencySymbolBig} />
          </div>
          {pendingAmount.incoming.greaterThan(0) &&
            <div className={styles.pendingConfirmation}>
              {`${intl.formatMessage(messages.pendingIncomingConfirmationLabel)}`}
              : {pendingAmount.incoming.toFormat(DECIMAL_PLACES_IN_LUX)}
              <SvgInline svg={luxSymbolSmallest} className={styles.currencySymbolSmallest} />
            </div>
          }
          {pendingAmount.outgoing.greaterThan(0) &&
            <div className={styles.pendingConfirmation}>
              {`${intl.formatMessage(messages.pendingOutgoingConfirmationLabel)}`}
              : {pendingAmount.outgoing.toFormat(DECIMAL_PLACES_IN_LUX)}
              <SvgInline svg={luxSymbolSmallest} className={styles.currencySymbolSmallest} />
            </div>
          }
          {!isLoadingTransactions ? (
            <div className={styles.numberOfTransactions}>
              {intl.formatMessage(messages.transactionsLabel)}: {numberOfTransactions}
            </div>
          ) : null}
        </BorderedBox>
      </div>
    );
  }

}
