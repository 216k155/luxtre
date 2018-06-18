// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import SendToContractDialog from '../../../components/wallet/smartcontracts/SendToContractDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  outputs: string,
  error: string
};

@inject('actions', 'stores') @observer
export default class SendToContractDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions, outputs, error } = this.props;
    const { uiDialogs } = this.props.stores;

    return (
      <SendToContractDialog
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
