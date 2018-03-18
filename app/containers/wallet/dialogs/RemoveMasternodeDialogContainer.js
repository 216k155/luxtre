// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import RemoveMasternodeDialog from '../../../components/wallet/masternodes/RemoveMasternodeDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

@inject('actions', 'stores') @observer
export default class RemoveMasternodeDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions } = this.props;
    const { uiDialogs } = this.props.stores;
    const { masternodes } = this.props.stores[environment.API];
    const dialogData = uiDialogs.dataForActiveDialog;
    //const { removeMasternodeRequest } = masternodes;

    return (
      <RemoveMasternodeDialog
        aliasValue={dialogData.aliasValue}
        addressValue={dialogData.addressValue}
        onRemove={(values: { alias: string}) => {
          actions[environment.API].masternodes.removeMasternode.trigger(values);
        }}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
          //removeMasternodeRequest.reset();
        }}
        //isSubmitting={removeMasternodeRequest.isExecuting}
        //error={removeMasternodeRequest.error}
      />
    );
  }

}
