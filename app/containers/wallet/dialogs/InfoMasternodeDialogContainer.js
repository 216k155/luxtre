// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import InfoMasternodeDialog from '../../../components/wallet/masternodes/InfoMasternodeDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

@inject('actions', 'stores') @observer
export default class InfoMasternodeDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions } = this.props;
    const { uiDialogs } = this.props.stores;
    const { wallets, masternodes } = this.props.stores[environment.API];
    const dialogData = uiDialogs.dataForActiveDialog;
    const activeWallet = wallets.active;

    if (!activeWallet) throw new Error('Active wallet required for CreateMasternodeDialogContainer.');

    return (
      <InfoMasternodeDialog
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
        //  CreateMasternodeResponse.reset();
        }}
      />
    );
  }

}
