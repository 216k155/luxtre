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
  removeMasternodeTitle: {
    id: 'wallet.masternode.remove.dialog.title',
    defaultMessage: '!!!Delete Adrenaline Node?',
    description: 'Title for the "Remove luxnodes node" dialog.',
  },
  nodeDescription: {
    id: 'wallet.masternode.remove.dialog.description',
    defaultMessage: '!!!Are you sure you want to delete this adrenaline node configuration?',
    description: 'Description for the "Remove luxnodes node" dialog.',
  }
});

type Props = {
  alias: string,
  onRemove: Function,
  onCancel: Function
};

@observer
export default class RemoveMasternodeDialog extends Component<Props, State> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  submit = (alias) => {
    this.props.onRemove({alias: alias});
  };

  render() {
    const { intl } = this.context;
    const {
      onCancel,
      alias,
    } = this.props;

    const confirmButtonClasses = classnames([
      'confirmButton'
    ]);

    const actions = [
      {
        label: 'No',
        onClick: onCancel
      },
      {
        label: 'Yes',//intl.formatMessage(messages.sendButtonLabel)
        onClick: this.submit.bind(this, alias),
        primary: true,
        className: confirmButtonClasses
      },
    ];

    return (
      <Dialog
        title={intl.formatMessage(messages.removeMasternodeTitle)}
        actions={actions}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
        <div className={styles.inputFields}>
          <p className={styles.instructions}>
            {intl.formatMessage(messages.nodeDescription)}
          </p>
        </div>

      </Dialog>
    );
  }

}
