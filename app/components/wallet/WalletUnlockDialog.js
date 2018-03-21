// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/InputSkin';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../utils/ReactToolboxMobxForm';
import Dialog from '../widgets/Dialog';
import DialogCloseButton from '../widgets/DialogCloseButton';
import globalMessages from '../../i18n/global-messages';
import LocalizableError from '../../i18n/LocalizableError';
import styles from './WalletUnlockDialog.scss';

export const messages = defineMessages({
  dialogTitle: {
    id: 'wallet.unlockDialog.title',
    defaultMessage: '!!!Unlock wallet',
    description: 'Title for the "Unlock wallet" dialog.'
  },
  walletPasswordLabel: {
    id: 'wallet.unlockDialog.walletPasswordLabel',
    defaultMessage: '!!!This operation needs your wallet passphrase to unlock the wallet.',
    description: 'Label for the "Wallet password" input in the unlock wallet dialog.',
  },
  walletPasswordFieldPlaceholder: {
    id: 'wallet.unlockDialog.walletPasswordFieldPlaceholder',
    defaultMessage: '!!!Type your wallet password',
    description: 'Placeholder for the "Wallet password" inputs in the unlock wallet dialog.',
  },
  okButtonLabel: {
    id: 'wallet.unlockDialog.submit',
    defaultMessage: '!!!Ok',
    description: 'Label for the ok button in the unlock wallet dialog.'
  },
  cancelButtonLabel: {
    id: 'wallet.unlockDialog.cancel',
    defaultMessage: '!!!Cancel',
    description: 'Label for the cancel button in the unlock wallet dialog.'
  },
});

messages.fieldIsRequired = globalMessages.fieldIsRequired;

type Props = {
  onSubmit: Function,
  onCancel: Function,
  //isSubmitting: boolean,
  //error: ?LocalizableError,
};

@observer
export default class WalletUnlockDialog extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  form = new ReactToolboxMobxForm({
    fields: {
      walletPassword: {
        type: 'password',
        label: this.context.intl.formatMessage(messages.walletPasswordLabel),
        placeholder: this.context.intl.formatMessage(messages.walletPasswordFieldPlaceholder),
        value: '',
        validators: [({ field }) => {
          if (field.value === '') {
            return [false, this.context.intl.formatMessage(messages.fieldIsRequired)];
          }
          return [true];
        }],
      },
    }
  }, {
    options: {
      validateOnChange: true,
      validationDebounceWait: 250,
    },
  });

  submit() {
    this.form.submit({
      onSuccess: (form) => {
        const { walletPassword } = form.values();
        this.props.onSubmit(walletPassword);
      },
      onError: () => {}
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const walletPasswordField = form.$('walletPassword');
    const {
      onCancel,
    } = this.props;

    const confirmButtonClasses = classnames([
      'confirmButton'
    ]);

    const actions = [
      {
        label: intl.formatMessage(messages.cancelButtonLabel),
        onClick: onCancel,
      },
      {
        label: intl.formatMessage(messages.okButtonLabel),
        onClick: this.submit.bind(this),
        primary: true,
        className: confirmButtonClasses
      }
    ];

    return (
      <Dialog
        title={intl.formatMessage(messages.dialogTitle)}
        actions={actions}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton />}
      >
        <div className={styles.walletPasswordFields}>
          <Input
            type="password"
            className={styles.walletPassword}
            {...walletPasswordField.bind()}
            error={walletPasswordField.error}
            skin={<SimpleInputSkin />}
            />
        </div>
        {/*error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null*/}
      </Dialog>
    );
  }

}
