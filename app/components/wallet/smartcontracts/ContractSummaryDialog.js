// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../../widgets/DialogCloseButton';
import Dialog from '../../widgets/Dialog';
import globalMessages from '../../../i18n/global-messages';
import LocalizableError from '../../../i18n/LocalizableError';
import styles from './ContractSummaryDialog.scss';

const messages = defineMessages({
  ContractSummaryTitle: {
    id: 'wallet.smartcontract.summary.dialog.title',
    defaultMessage: 'Smart Contract',
    description: 'Title for the "smart contract summary" dialog.',
  },
});

type Props = {
  outputs: string,
  error: ?LocalizableError,
  onCancel: Function
};

@observer
export default class ContractSummaryDialog extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };
  
  static defaultProps = {
    outputs: '',
    error: null,
  };
 
  render() {
    const { intl } = this.context;
    const {
      outputs,
      error,
      onCancel
    } = this.props;

    const actions = [
      {
        label: 'Close',
        onClick: onCancel
      }
    ];

    return (
      <Dialog
        title={intl.formatMessage(messages.ContractSummaryTitle)}
        actions={actions}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
      {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : 
        <div className={styles.info}>
          <div> txid: {outputs.txid}</div>
          <div> sender: {outputs.sender}</div>
          <div> hash160: {outputs.hash160}</div>
          <div> address: {outputs.address}</div>
        </div>
      }
      </Dialog>
    );
  }

}
