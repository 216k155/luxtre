// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import RenameWalletConfirmationDialog from '../../../components/wallet/settings/RenameWalletConfirmationDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';

type Props = InjectedProps;

@inject('actions', 'stores') @observer
export default class RenameWalletDialogContainer extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { actions } = this.props;
    const { uiDialogs } = this.props.stores;
    const { wallets } = this.props.stores[environment.API];
    const dialogData = uiDialogs.dataForActiveDialog;
    const { updateDataForActiveDialog } = actions.dialogs;
    const activeWallet = wallets.active;
    const { renameWalletRequest } = wallets;

    // Guard against potential null values
    if (!activeWallet) throw new Error('Active wallet required for RenameWalletDialogContainer.');

    return (
      <RenameWalletConfirmationDialog
        walletName={activeWallet.name}
        hasWalletFunds={activeWallet.hasFunds}
        countdownFn={uiDialogs.countdownSinceDialogOpened}
        isBackupNoticeAccepted={dialogData.isBackupNoticeAccepted}
        onAcceptBackupNotice={() => updateDataForActiveDialog.trigger({
          data: { isBackupNoticeAccepted: true }
        })}
        onContinue={() => {
          actions[environment.API].wallets.renameWallet.trigger({ walletId: activeWallet.id });
        }}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
          renameWalletRequest.reset();
        }}
        confirmationValue={dialogData.confirmationValue}
        onConfirmationValueChange={confirmationValue => updateDataForActiveDialog.trigger({
          data: { confirmationValue }
        })}
        isSubmitting={renameWalletRequest.isExecuting}
      />
    );
  }

}
