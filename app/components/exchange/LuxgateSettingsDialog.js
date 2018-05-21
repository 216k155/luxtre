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
import styles from './LuxgateSettingsDialog.scss';
import iconCopy from '../../assets/images/clipboard-ic.inline.svg';
import SvgInline from 'react-svg-inline';
import CopyToClipboard from 'react-copy-to-clipboard';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/InputSkin';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import DialogBackButton from '../widgets/DialogBackButton';
import Checkbox from 'react-polymorph/lib/components/Checkbox';
import TogglerSkin from 'react-polymorph/lib/skins/simple/TogglerSkin';
import checkIcon from '../../assets/images/icons/check.png';
import crossIcon from '../../assets/images/icons/cross.png';
import COINS from "./coins";

export const messages = defineMessages({
    dialogTitle: {
      id: 'luxgate.settings.dialog.title',
      defaultMessage: '!!!Luxgate Settings',
      description: 'Title "Luxgate Settings" in the luxgate settings dialog.'
    },
    tableHeadLabelState: {
      id: 'luxgate.settings.dialog.tablehead.state',
      defaultMessage: `!!!State`,
      description: 'Label for TableHeaderLabel "State" on settings dialog'
    },
    tableHeadLabelType: {
        id: 'luxgate.settings.dialog.tablehead.type',
        defaultMessage: `!!!Type`,
        description: 'Label for TableHeaderLabel "Type" on settings dialog'
      },
    buttonLabelSave: {
      id: 'luxgate.settings.dialog.button.labelSave',
      defaultMessage: '!!!Save',
      description: 'Label for button "Save" on settings dialog'
    },
    buttonLabelCancel: {
      id: 'luxgate.settings.dialog.button.labelCancel',
      defaultMessage: '!!!Cancel',
      description: 'Label for button "Cancel" on settings dialog'
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
export default class LuxgateSettingsDialog extends Component<Props, State> {

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

        const actions = [];

        actions.push({
          label: intl.formatMessage(messages.buttonLabelCancel),
          onClick: () => {this.switchNewPhrase(true)},
          primary: true
        });
    
        //if (!isNewPhrase) {
          actions.unshift({
            label: intl.formatMessage(messages.buttonLabelSave),
            onClick: () => {this.loginWithPhrase()},
            disabled: !isMatched,
        });
        //}

        return (
            <Dialog
                title={intl.formatMessage(messages.dialogTitle)}
                closeOnOverlayClick
                actions={actions}
                className={styles.dialog}
                onClose={onCancel}
                closeButton={<DialogCloseButton onClose={onCancel} />}
                backButton={isNewPhrase ? <DialogBackButton onBack={() => {this.switchNewPhrase(false)}} /> : null}
              >
        
                <table className={styles.coinTable}>
                    <thead>
                        <tr>
                            <th className={styles.coinNameCell}></th>
                            <th valign="center" className={styles.coinStateCell}>{intl.formatMessage(messages.tableHeadLabelState)}</th>
                            <th className={styles.coinTypeCell}>{intl.formatMessage(messages.tableHeadLabelType)}</th>
                        </tr>
                    </thead>
                {COINS.map((coin, index) => (
                    <tr>
                        <td className={styles.coinNameCell}>
                            <img src={require('../../assets/crypto/' + coin.value + '.png')} className={styles.coinImageStyle}/>
                            <span>{coin.label}</span>
                        </td>
                        <td className={styles.coinStateCell}>
                            <img className={styles.icon} src={crossIcon} role="presentation" />
                        </td>
                        <td className={styles.coinTypeCell}>
                            <Checkbox
                                className={styles.checkboxTab}
                                labelLeft="Local"
                                labelRight="Remote"
                                //onChange={this.toggleBuySell.bind(this)}
                                //checked={isBuy}
                                skin={<TogglerSkin/>}
                            />
                        </td>
                    </tr>
                ))}
                </table>
            </Dialog>
        );
    }

}
