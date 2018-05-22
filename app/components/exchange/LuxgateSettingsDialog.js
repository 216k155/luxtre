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
import { CoinSettingInfo } from '../../domain/CoinSettingInfo';
import COINS from "./coins";

export const messages = defineMessages({
    dialogTitle: {
      id: 'luxgate.settings.dialog.title',
      defaultMessage: '!!!Luxgate Settings',
      description: 'Title "Luxgate Settings" in the luxgate settings dialog.'
    },
    tableHeadLabelCoin: {
        id: 'luxgate.settings.dialog.tablehead.coin',
        defaultMessage: `!!!Coin`,
        description: 'Label for TableHeaderLabel "Coin" on settings dialog'
    },
    tableHeadLabelState: {
      id: 'luxgate.settings.dialog.tablehead.state',
      defaultMessage: `!!!Active`,
      description: 'Label for TableHeaderLabel "Active" on settings dialog'
    },
    tableHeadLabelType: {
        id: 'luxgate.settings.dialog.tablehead.type',
        defaultMessage: `!!!Wallet`,
        description: 'Label for TableHeaderLabel "Wallet" on settings dialog'
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
    coins: Array<Object>,
}

@observer
export default class LuxgateSettingsDialog extends Component<Props, State> {

    static defaultProps = {
        newPhrase: '',
        error: null,
        children: null
    };
 
    state = {
        coins: COINS
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    getInitialState() {
        return { coins : COINS };
    }

    componentDidMount() {
    //    this.setState ( {settingArray : COINS});
    }

    onClickCoinState(event) {
        const td_value = event.target.parentNode;
        const index = td_value.getAttribute('data-index');

        let coins = [...this.state.coins];
        let item = {...coins[index]};

        item.active = !item.active;
        coins[index] = item;

        this.setState({coins});

        /*
        let exist = -1;
        this.state.settingArray.map((info, index) => {
            if(info.coin == value) {
                exist = index;
                return;
            }
        });

        if (exist != -1) {
            this.setState ({
                settingArray : this.state.settingArray.splice(exist, 1)
            });
            return;
        } 

        const coin = value;
        const wallet = false;
        const newElement = [{coin, wallet}];
        this.setState ({
            settingArray : this.state.settingArray.concat(newElement)
        });

        /*
        for(var i=0; i < this.state.settingArray.length; i++)
        {
          if(this.state.settingArray.coin === value)
          {
            this.state.settingArray.splice(i, 1);
            return;
          }
        }
        */
    }

    onChangeWalletType(value, event) {
        const td_value = event.target.parentNode.parentNode.parentNode;
        const index = td_value.getAttribute('data-index');

        let coins = [...this.state.coins];
        let item = {...coins[index]};

        if(item.IsOnlyLocal)
            return;

        item.wallet = !item.wallet;
        coins[index] = item;

        this.setState({coins});
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

    saveSettings() {
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
            coins
        } = this.state;

        const actions = [];

        actions.push({
          label: intl.formatMessage(messages.buttonLabelCancel),
          onClick: onCancel
        });
    
        actions.unshift({
            label: intl.formatMessage(messages.buttonLabelSave),
            onClick: () => {this.saveSettings()},
            primary: true
        });

        return (
            <Dialog
                title={intl.formatMessage(messages.dialogTitle)}
                closeOnOverlayClick
                actions={actions}
                className={styles.dialog}
                onClose={onCancel}
                closeButton={<DialogCloseButton onClose={onCancel} />}
              >
        
                <table className={styles.coinTable}>
                    <thead>
                        <tr>
                            <th className={styles.coinNameHeadCell}>{intl.formatMessage(messages.tableHeadLabelCoin)}</th>
                            <th className={styles.coinTypeCell}>{intl.formatMessage(messages.tableHeadLabelType)}</th>
                            <th className={styles.coinStateCell}>{intl.formatMessage(messages.tableHeadLabelState)}</th>
                        </tr>
                    </thead>
                {
                    coins.map((coin, index) => {
                        return (
                            <tr>
                                <td className={styles.coinNameCell}>
                                    <img src={require('../../assets/crypto/' + coin.value + '.png')} className={styles.coinImageStyle}/>
                                    <span>{coin.label}</span>
                                </td>
                                <td className={styles.coinTypeCell} data-index={index}>
                                    <Checkbox
                                        className={styles.checkboxTab}
                                        labelLeft="Local"
                                        labelRight="Remote"
                                        onChange={this.onChangeWalletType.bind(this)}
                                        checked={coin.wallet}
                                        skin={<TogglerSkin/>}
                                    />
                                </td>
                                <td className={styles.coinStateCell} data-index={index}>
                                    { coin.active ? (
                                        <img className={styles.icon} src={checkIcon} role="presentation" onClick={this.onClickCoinState.bind(this)}/>
                                      ) : (
                                        <img className={styles.icon} src={crossIcon} role="presentation" onClick={this.onClickCoinState.bind(this)}/>
                                    )}
                                </td>
                            </tr>
                        )
                    })
                }
                </table>
            </Dialog>
        );
    }

}
