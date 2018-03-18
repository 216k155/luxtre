// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import MyMasternode from '../../../domain/MyMasternode';
import moment from 'moment';
import styles from './MasternodeListStyle.scss';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import CreateMasternodeDialog from './CreateMasternodeDialog';
import CreateMasternodeDialogContainer from '../../../containers/wallet/dialogs/CreateMasternodeDialogContainer';
import InfoMasternodeDialog from './InfoMasternodeDialog';
import InfoMasternodeDialogContainer from '../../../containers/wallet/dialogs/InfoMasternodeDialogContainer';
import RemoveMasternodeDialog from './RemoveMasternodeDialog';
import RemoveMasternodeDialogContainer from '../../../containers/wallet/dialogs/RemoveMasternodeDialogContainer';
import SvgInline from 'react-svg-inline';
import CopyToClipboard from 'react-copy-to-clipboard';
//import iconCopy from '../../../assets/images/copy.inline.svg';
import iconCopy from '../../../assets/images/clipboard-ic.inline.svg';
import iconRemove from '../../../assets/images/trash.inline.svg';
import iconInfo from '../../../assets/images/info.inline.svg';

type Props = {
  openDialogAction: Function,
  isDialogOpen: Function,
  myMasternodeList: Array<MyMasternode>
};

@observer
export default class Masternode extends Component<Props> {

  state = {
    alias: '',
    address: '',
    privateKey: ''
  };

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

  render() {
    const {myMasternodeList} = this.props;
    const {
      openDialogAction, 
      isDialogOpen,
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
                  onCopy={CopyToClipboard.bind(this, myMasternode.collateralAddress)}
                >
                  <SvgInline svg={iconCopy} className={styles.copyIconBig} />
                </CopyToClipboard>
              </div>
              <div className={styles.iconRegion}>
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

        <button
            className={styles.buttonStyle}
            onClick={() => {
              console.log("start");
            }}
          >
            Start
        </button>
        <button
            className={styles.buttonStyle}
            onClick={() => {
              console.log("Stop");
            }}
          >
            Stop
        </button>
        <button
            className={styles.buttonStyle}
            onClick={() => {
              console.log("Start All");
            }}
          >
            All Start
        </button>
        <button
            className={styles.buttonStyle}
            onClick={() => {
              console.log("Stop All");
            }}
          >
            Stop All
        </button>
        <button
            className={styles.buttonStyle}
            onClick={() => {
              console.log("Get Outputs");
            }}
          >
            Get Outputs
        </button>
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
      </div>
    );
  }

}
