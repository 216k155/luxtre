// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import CreateMasternodeDialog from '../../../components/wallet/masternodes/CreateMasternodeDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

@inject('actions', 'stores') @observer
export default class CreateMasternodeDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions } = this.props;
    const { uiDialogs } = this.props.stores;
    const { wallets, masternodes } = this.props.stores[environment.API];
    const dialogData = uiDialogs.dataForActiveDialog;
    const activeWallet = wallets.active;
    const { CreateMasternodeResponse } = masternodes;

    if (!activeWallet) throw new Error('Active wallet required for CreateMasternodeDialogContainer.');

    return (
      <CreateMasternodeDialog
        aliasValue={dialogData.aliasValue}
        addressValue={dialogData.addressValue}
        onCreate={(values: { alias: string, address: string }) => {
          const walletId = activeWallet.id;
          const { alias, address } = values;
//          actions[environment.API].masternodes.updateWalletPassword.trigger({
//            walletId, alias, address
//          });
        }}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
        //  CreateMasternodeResponse.reset();
        }}
      //  isSubmitting={CreateMasternodeResponse.isExecuting}
      //  error={CreateMasternodeResponse.error}
      />
    );
  }

}
