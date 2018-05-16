// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape, FormattedHTMLMessage } from 'react-intl';
import ReactToolboxMobxForm from '../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../widgets/DialogCloseButton';
import Dialog from '../widgets/Dialog';
import QRCode from 'qrcode.react';
import globalMessages from '../../i18n/global-messages';
import LocalizableError from '../../i18n/LocalizableError';
import styles from './ReceiveAddressDialog.scss';
import iconCopy from '../../assets/images/clipboard-ic.inline.svg';
import SvgInline from 'react-svg-inline';
import CopyToClipboard from 'react-copy-to-clipboard';

export const messages = defineMessages({
    dialogTitle: {
      id: 'luxgate.login.dialog.title',
      defaultMessage: '!!!Welcome, Please Login',
      description: 'Title "Welcome, Please Login" in the luxgate login form.'
    },
    backupInstructions: {
      id: 'luxgate.login.dialog.backup.instructions',
      defaultMessage: `!!!Please, make sure you have carefully written down your recovery phrase somewhere safe.
      You will need this phrase later for next use and recover. Phrase is case sensitive.`,
      description: 'Instructions for backing up recovery phrase on dialog that displays recovery phrase.'
    },
    amountLabel: {
      id: 'wallet.send.form.amount.label',
      defaultMessage: '!!!Amount',
      description: 'Label for the "Amount" number input in the wallet send form.'
    },
    invalidAmount: {
      id: 'wallet.send.form.errors.invalidAmount',
      defaultMessage: '!!!Please enter a valid amount.',
      description: 'Error message shown when invalid amount was entered.',
    }
});

messages.fieldIsRequired = globalMessages.fieldIsRequired;

type Props = {
    newPhrase: string,
    walletAddress: string,
    onCopyAddress: Function,
    error: ?LocalizableError,
    onCancel: Function,
    children: Node
};

type State = {
    isNewPhrase: boolean
}

@observer
export default class LuxgateLoginDialog extends Component<Props, State> {

    static defaultProps = {
        newPhrase: '',
        error: null,
        children: null
    };
 
    state = {
        isNewPhrase: false
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    render() {
        const { intl } = this.context;
        const {
            newPhrase,
            onCopyAddress,
            error,
            onCancel,
            children
        } = this.props;

        const {
            isNewPhrase
        } = this.state;

        const actions = [
            {
                label: 'Close',
                onClick: onCancel
            }
        ];

        return (
            <Dialog
                title={intl.formatMessage(messages.dialogTitle)}
                actions={actions}
                closeOnOverlayClick
                onClose={onCancel}
                className={styles.dialog}
                closeButton={<DialogCloseButton onClose={onCancel} />}
              >
                { isNewPhrase ? (
                    <div>
                        <FormattedHTMLMessage {...messages.backupInstructions} />
                        <div className={styles.phrase}>{newPhrase}</div>
                    </div>
                ) : (
                    null
                )}
                {children}
            </Dialog>
        );
    }

}
