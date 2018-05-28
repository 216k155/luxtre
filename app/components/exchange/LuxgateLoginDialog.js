// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape, FormattedHTMLMessage } from 'react-intl';
import ReactToolboxMobxForm from '../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../widgets/DialogCloseButton';
import Dialog from '../widgets/Dialog';
import globalMessages from '../../i18n/global-messages';
import LocalizableError from '../../i18n/LocalizableError';
import styles from './LuxgateLoginDialog.scss';
import iconCopy from '../../assets/images/clipboard-ic.inline.svg';
import SvgInline from 'react-svg-inline';
import CopyToClipboard from 'react-copy-to-clipboard';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/InputSkin';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import DialogBackButton from '../widgets/DialogBackButton';
import luxgateIcon from '../../assets/images/luxgate-icon.png';

export const messages = defineMessages({
    dialogTitle: {
      id: 'luxgate.login.dialog.title',
      defaultMessage: '!!!Welcome to Luxgate, Please Login',
      description: 'Title "Welcome to Luxgate, Please Login" in the luxgate login form.'
    },
    backupInstructions: {
      id: 'luxgate.login.dialog.backup.instructions',
      defaultMessage: `!!!Please, make sure you have carefully written down your new phrase somewhere safe.
      You will need this phrase later for next use and recover. Phrase is case sensitive.`,
      description: 'Instructions for backing up recovery phrase on dialog that displays recovery phrase.'
    },
    buttonLabelLogin: {
      id: 'luxgate.login.dialog.button.labelLogin',
      defaultMessage: '!!!Login with My Account',
      description: 'Label for button "Login with My Account" on Login dialog'
    },
    buttonLabelNewPhrase: {
      id: 'luxgate.login.dialog.button.labelNewPhrase',
      defaultMessage: '!!!Create New Account',
      description: 'Label for button "Create New Account" on Login dialog'
    },
});

messages.fieldIsRequired = globalMessages.fieldIsRequired;

type Props = {
    newPhrase: string,
    onCopyAddress: Function,
    error: ?LocalizableError,
    onCancel: Function,
    onLoginWithPhrase: Function,
    onCreateNewPhrase: Function,
    children: Node
};

type State = {
    account: string,
    isMatched: boolean,
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
        account: '',
        isMatched: true,
        isNewPhrase: false
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    switchNewPhrase(isNew) {
        this.setState( {isNewPhrase: isNew});
        this.setState( {isMatched: !isNew});
        if(isNew) this.props.onCreateNewPhrase();
    }

    changeAccountInput(value) {
        this.setState({ account: value });

        if(!this.state.isNewPhrase) {
            this.setState( {isMatched: true});
            return;
        }

        const value1 = value.split(' ').join('');
        const value2 = this.props.newPhrase.split(' ').join('');
        if(value1 == value2)
            this.setState( {isMatched: true});
        else 
            this.setState( {isMatched: false});
    }

    loginWithPhrase() {
        if(this.state.account.length > 10)
        {
            this.props.onLoginWithPhrase(this.state.account);
            this.props.onCancel();
        }
    }

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
            account,
            isMatched,
            isNewPhrase
        } = this.state;

        const inputStyle = classnames([
            isNewPhrase ? styles.zeroMargin : styles.password,
          ]);

        const actions = [];

        actions.push({
          label: intl.formatMessage(messages.buttonLabelNewPhrase),
          onClick: () => {this.switchNewPhrase(true)},
          primary: true
        });
    
        //if (!isNewPhrase) {
          actions.unshift({
            label: intl.formatMessage(messages.buttonLabelLogin),
            onClick: () => {this.loginWithPhrase()},
            disabled: !isMatched,
        });
        //}

        return (
            <Dialog
                closeOnOverlayClick
                actions={actions}
                className={styles.dialog}
                onClose={onCancel}
                closeButton={<DialogCloseButton onClose={onCancel} />}
                backButton={isNewPhrase ? <DialogBackButton onBack={() => {this.switchNewPhrase(false)}} /> : null}
              >
                <img className={styles.icon} src={luxgateIcon} role="presentation" />

                { isNewPhrase ? (
                    <div >
                        <FormattedHTMLMessage {...messages.backupInstructions} />
                        <div className={styles.phrase}>{newPhrase}</div>
                    </div>
                ) : (
                    <div className={styles.title}> {intl.formatMessage(messages.dialogTitle)} </div>
                )}

                <Input
                    className={inputStyle}
                    value={account}
                    onChange={this.changeAccountInput.bind(this)}
                    skin={<SimpleInputSkin />}
                  />

                {children}
            </Dialog>
        );
    }

}
