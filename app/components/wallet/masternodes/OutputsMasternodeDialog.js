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
import styles from './MasternodeDialog.scss';

const messages = defineMessages({
  outputsMasternodeTitle: {
    id: 'wallet.masternode.outputs.dialog.title',
    defaultMessage: '!!!LuxNode Outputs',
    description: 'Title for the "luxnode Outputs" dialog.',
  },
});

type Props = {
  outputs: string,
  error: ?LocalizableError,
  onCancel: Function
};

@observer
export default class OutputsMasternodeDialog extends Component<Props> {

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
        title={intl.formatMessage(messages.outputsMasternodeTitle)}
        actions={actions}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
        <div className={styles.info}>
          <div> {outputs}</div>
        </div>
        {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}

      </Dialog>
    );
  }

}
