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
import styles from './SendToContractDialog.scss';

const messages = defineMessages({
  SendToContractTitle: {
    id: 'smartcontract.sendto.dialog.title',
    defaultMessage: '!!!Send to Smart Contract',
    description: 'Title for the "send to smart contract" dialog.',
  },
});

type Props = {
  outputs: object,
  error: ?LocalizableError,
  onCancel: Function
};

@observer
export default class SendToContractDialog extends Component<Props> {

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
        title={intl.formatMessage(messages.SendToContractTitle)}
        actions={actions}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
      {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : 
        <div className={styles.info}>
          <br/>
          <div> <strong>txid:</strong> {outputs.txid}</div>
          <br/>
          <div> <strong>sender:</strong> {outputs.sender}</div>
          <br/>
          <div> <strong>hash160:</strong> {outputs.hash160}</div>
          <br/>
        </div>
      }
      </Dialog>
    );
  }

}
