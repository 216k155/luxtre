// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import type { StoresMap } from '../../../stores/index';
import type { ActionsMap } from '../../../actions/index';
import environment from '../../../environment';
import resolver from '../../../utils/imports';

const WalletUnlockDialog = resolver('components/wallet/WalletUnlockDialog');

type Props = {
  masternodeAction: Function,
  unlockWallet: Function,
  stores: any | StoresMap,
  actions: any | ActionsMap,
  actionType: string,
};

@inject('actions', 'stores') @observer
export default class WalletUnlockDialogContainer extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  handleUnlockWalletSubmit = (password: string) => {
    const { actionType, alias} = this.props;
    switch (actionType){
      case 'start':
        this.props.masternodeAction('start', {alias: alias, password: password});
        break;
      case 'stop':
        this.props.masternodeAction('stop', {alias: alias, password: password});
        break;
      case 'startMany':
        this.props.masternodeAction('startMany', {password: password});
        break;
      case 'stopMany':
        this.props.masternodeAction('stopMany', {password: password});
        break;
      case 'unlock':
        this.props.unlockWallet(password);
        break;
    }
  };

  handleUnlockWalletCancel = () => {
    const {actionType} = this.props;
    const { masternodes, walletSettings } = this.props.stores[environment.API];
    const { 
      startMasternodeRequest,
      stopMasternodeRequest,
      startManyMasternodeRequest,
      stopManyMasternodeRequest,
     } = masternodes;

     const {unlockWalletRequest} = walletSettings;
     switch (actionType){
      case 'start':
        startMasternodeRequest.reset();
        break;
      case 'stop':
        stopMasternodeRequest.reset();
        break;
      case 'startMany':
        startManyMasternodeRequest.reset();
        break;
      case 'stopMany':
        stopMasternodeRequest.reset();
        break;
      case 'unlock':
        unlockWalletRequest.reset();
        break;
    }
  }

  render() {
    const { actions } = this.props;
    const { wallets } = this.props.stores[environment.API];
    const activeWallet = wallets.active;

    if (!activeWallet) throw new Error('Active wallet required for WalletSendPage.');

    return (
      <WalletUnlockDialog
        onSubmit={this.handleUnlockWalletSubmit}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
          this.handleUnlockWalletCancel();
        }}
      />
    );
  }

}
