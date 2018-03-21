// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import MyMasternode from '../../../domain/MyMasternode';
import moment from 'moment';
import styles from './MasternodeListStyle.scss';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import LocalizableError from '../../../i18n/LocalizableError';
import CreateMasternodeDialog from './CreateMasternodeDialog';
import CreateMasternodeDialogContainer from '../../../containers/wallet/dialogs/CreateMasternodeDialogContainer';
import InfoMasternodeDialog from './InfoMasternodeDialog';
import InfoMasternodeDialogContainer from '../../../containers/wallet/dialogs/InfoMasternodeDialogContainer';
import RemoveMasternodeDialog from './RemoveMasternodeDialog';
import RemoveMasternodeDialogContainer from '../../../containers/wallet/dialogs/RemoveMasternodeDialogContainer';
import OutputsMasternodeDialog from './OutputsMasternodeDialog';
import OutputsMasternodeDialogContainer from '../../../containers/wallet/dialogs/OutputsMasternodeDialogContainer';
import WalletUnlockDialog from '../../../components/wallet/WalletUnlockDialog';
import WalletUnlockDialogContainer from '../../../containers/wallet/dialogs/WalletUnlockDialogContainer';
import SvgInline from 'react-svg-inline';
import CopyToClipboard from 'react-copy-to-clipboard';
import iconCopy from '../../../assets/images/clipboard-ic.inline.svg';
import iconRemove from '../../../assets/images/masternode-remove.inline.svg';
import iconInfo from '../../../assets/images/info.inline.svg';
import iconStart from '../../../assets/images/masternode-start.inline.svg';
import iconStop from '../../../assets/images/masternode-stop.inline.svg';

type Props = {
  getMasternodeOutputs: Function,
  masternodeAction: Function,
  openDialogAction: Function,
  isDialogOpen: Function,
  onCopyAddress: Function,
  isWalletPasswordSet: Boolean,
  myMasternodeList: Array<MyMasternode>,
  error: ?LocalizableError
};

@observer
export default class Masternode extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    alias: '',
    address: '',
    privateKey: '',
    outputs: '',
    outputsError: null,
    actionType: ''
  };

  _isMounted = false;
  
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleInfoClick(address, privateKey) {
    const { openDialogAction } = this.props;

    this.setState({ 
      address: address,
      privateKey: privateKey
     });

     openDialogAction({dialog: InfoMasternodeDialog});
  }

  handleRemoveClick(alias) {
    const { openDialogAction } = this.props;

    this.setState({ alias: alias });

     openDialogAction({dialog: RemoveMasternodeDialog});
  }

  handelMasternodeAction(actionType, values){
    this.props.masternodeAction(actionType, values);
  }

  async _getMasternodeOutputs() {
    try {
      const outputs = await this.props.getMasternodeOutputs();
      if (this._isMounted) {
        this.setState({
          outputs: outputs,
          outputsError: null,
        });
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          outputsError: this.context.intl.formatMessage(error)
        });
      }
    }
  }

  render() {

    const { intl } = this.context;

    const {
      openDialogAction, 
      isDialogOpen,
      onCopyAddress,
      isWalletPasswordSet,
      myMasternodeList,
      error
    } = this.props;

/*
        <div className={styles.tbTitle}>
          <div className={styles.Address}> Address </div>
          <div className={styles.Rank}> Rank </div>
          <div className={styles.Activate}> Activate </div>
          <div className={styles.ActiveTime}> ActiveTime </div>
          <div className={styles.LastSeen}> LastSeen </div>
          <div className={styles.Pubkey}> Pubkey </div>
        </div>
*/
    return (
      <div className={styles.component}>
        <button
            className={styles.button}
            onClick={() => openDialogAction({
              dialog: CreateMasternodeDialog,
            })}
          >
            Create
        </button>
        <button
            className={styles.button}
            onClick={() => {
              this._getMasternodeOutputs();
              openDialogAction({dialog: OutputsMasternodeDialog});
            }}
          >
            Get Outputs
        </button>
        <button
            className={styles.button}
            onClick={() => {
              if(isWalletPasswordSet)
              {
                this.setState({ actionType: 'startMany' });
                openDialogAction({dialog: WalletUnlockDialog});
              }
              else
              {
                this.props.masternodeAction('startMany', {password:''});
              }
            }}
          >
            Start All
        </button>
        <button
            className={styles.button}
            onClick={() => {
              if(isWalletPasswordSet)
              {
                this.setState({ actionType: 'stopMany' });
                openDialogAction({dialog: WalletUnlockDialog});
              }
              else
              {
                this.props.masternodeAction('stopMany', {password:''});
              }
            }}
          >
            Stop All
        </button>
        <div className={styles.listRegion}>
          {myMasternodeList.map((myMasternode, index) => (
            <div key={index} className={styles.list}>
              <div className={styles.Alias} onClick={this.handleInfoClick.bind(this, myMasternode.address, myMasternode.privateKey)}> 
                <u>{myMasternode.alias}</u>
              </div>
              <div className={styles.IP} onClick={this.handleInfoClick.bind(this, myMasternode.address, myMasternode.privateKey)}> 
                <u>{myMasternode.address}</u> 
              </div>
              <div className={styles.Status} onClick={this.handleInfoClick.bind(this, myMasternode.address, myMasternode.privateKey)}> 
                {myMasternode.status} 
              </div>
              <div className={styles.Collateral}> 
                {myMasternode.collateralAddress}
                <CopyToClipboard
                  text={myMasternode.collateralAddress}
                  onCopy={onCopyAddress.bind(this, myMasternode.collateralAddress)}
                >
                  <SvgInline svg={iconCopy} className={styles.copyIconBig} />
                </CopyToClipboard>
              </div>
              <div className={styles.iconRegion}>
                <button
                    onClick={() => {
                      if(isWalletPasswordSet)
                      {
                        this.setState({ 
                          actionType: 'start',
                          alias: myMasternode.alias 
                        });
                        openDialogAction({dialog: WalletUnlockDialog});
                      }
                      else
                      {
                        this.props.masternodeAction('start', {alias: myMasternode.alias, password:''});
                      }
                    }}
                >
                  <SvgInline svg={iconStart} className={styles.copyIconBigger} />
                </button>
                <button
                    onClick={() => {
                      if(isWalletPasswordSet)
                      {
                        this.setState({ 
                          actionType: 'stop',
                          alias: myMasternode.alias 
                        });
                        openDialogAction({dialog: WalletUnlockDialog});
                      }
                      else
                      {
                        this.props.masternodeAction('stop', {alias: myMasternode.alias, password:''});
                      }
                    }}
                >
                  <SvgInline svg={iconStop} className={styles.copyIconBigger} />
                </button>
                <button
                    onClick={() => openDialogAction({
                      dialog: RemoveMasternodeDialog,
                    })}
                >
                  <SvgInline svg={iconRemove} className={styles.copyIconBigger} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {isDialogOpen(CreateMasternodeDialog) ? (
          <CreateMasternodeDialogContainer />
        ) : null}
        {isDialogOpen(InfoMasternodeDialog) ? (
          <InfoMasternodeDialogContainer 
            address = {this.state.address}
            privateKey = {this.state.privateKey}
          />
        ) : null}
        {isDialogOpen(RemoveMasternodeDialog) ? (
          <RemoveMasternodeDialogContainer 
            alias = {this.state.alias}
          />
        ) : null}
        {isDialogOpen(OutputsMasternodeDialog) ? (
          <OutputsMasternodeDialogContainer 
            outputs = {this.state.outputs}
            error = {this.state.outputsError}
          />
        ) : null}
        {isDialogOpen(WalletUnlockDialog) ? (
          <WalletUnlockDialogContainer 
            alias = {this.state.alias}
            actionType = {this.state.actionType}
            masternodeAction = {(actionType, values) => (
              this.handelMasternodeAction(actionType, values)
            )}
          />
        ) : null}

      </div>
    );
  }

}
