// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import OutputsMasternodeDialog from '../../../components/wallet/masternodes/OutputsMasternodeDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  outputs: string,
  error: string
};

@inject('actions', 'stores') @observer
export default class OutputsMasternodeDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions, outputs, error } = this.props;
    const { uiDialogs } = this.props.stores;
    const { wallets, masternodes } = this.props.stores[environment.API];
    const dialogData = uiDialogs.dataForActiveDialog;
    const activeWallet = wallets.active;

    if (!activeWallet) throw new Error('Active wallet required for CreateMasternodeDialogContainer.');

    return (
      <OutputsMasternodeDialog
        outputs = {outputs}
        error = {error}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
        //  CreateMasternodeResponse.reset();
        }}
      />
    );
  }

}
