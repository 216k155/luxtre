import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import BigNumber from 'bignumber.js';
import InputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import styles from './AmountInputSkin.scss';

export const messages = defineMessages({
  feesLabel: {
    id: 'wallet.amountInput.feesLabel',
    defaultMessage: '!!!+ {amount} of fees',
    description: 'Label for the "+ 12.042481 of fees" message above amount input field.'
  },
});

type Props = {
  currency: string,
  total: BigNumber,
  error: boolean,
};

export default class AmountInputSkin extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { error, total, currency } = this.props;
    const { intl } = this.context;

    return (
      <div className={styles.root}>
        <InputSkin {...this.props} />
        <span className={styles.total}>
          {!error && `= ${total} `}{currency}
        </span>
      </div>
    );
  }

}
