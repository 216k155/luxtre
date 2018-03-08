import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import styles from './RenameWalletButton.scss';

const messages = defineMessages({
  label: {
    id: 'wallet.settings.renameWalletButtonLabel',
    defaultMessage: '!!!Rename Wallet',
    description: 'Label for the delete button on wallet settings',
  },
});

type Props = {
  onClick: Function,
};

export default class RenameWalletButton extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { onClick } = this.props;
    return (
      <button onClick={onClick} className={styles.button}>
        {this.context.intl.formatMessage(messages.label)}
      </button>
    );
  }
}
