// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import InfoMasternodeDialog from '../../../components/wallet/masternodes/InfoMasternodeDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  address: string,
  privateKey: string
};

@inject('actions', 'stores') @observer
export default class InfoMasternodeDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions, address, privateKey } = this.props;
    const { uiDialogs } = this.props.stores;
    const { wallets, masternodes } = this.props.stores[environment.API];
    const dialogData = uiDialogs.dataForActiveDialog;
    const activeWallet = wallets.active;

    if (!activeWallet) throw new Error('Active wallet required for CreateMasternodeDialogContainer.');

    return (
      <InfoMasternodeDialog
        masternodeaddr = {address}
        masternodeprivkey = {privateKey}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
        //  CreateMasternodeResponse.reset();
        }}
      />
    );
  }

}
