// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ContractSummaryDialog from '../../../components/wallet/smartcontracts/ContractSummaryDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  outputs: string,
  error: string
};

@inject('actions', 'stores') @observer
export default class ContractSummaryDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions, outputs, error } = this.props;
    const { uiDialogs } = this.props.stores;

    return (
      <ContractSummaryDialog
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
