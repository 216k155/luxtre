// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import moment from 'moment';
import environment from '../../environment';
import LocalizableError from '../../i18n/LocalizableError';
import Button from 'react-polymorph/lib/components/Button';
import SimpleButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import BorderedBox from '../widgets/BorderedBox';
import InlineEditingInput from '../widgets/forms/InlineEditingInput';
import InlineEditingDropdown from '../widgets/forms/InlineEditingDropdown';
import ReadOnlyInput from '../widgets/forms/ReadOnlyInput';
import RenameWalletButton from './settings/RenameWalletButton';
import RenameWalletConfirmationDialog from './settings/RenameWalletConfirmationDialog';
import RenameWalletDialogContainer from '../../containers/wallet/dialogs/RenameWalletDialogContainer';
import WalletExportDialog from './settings/export-to-file/WalletExportToFileDialog';
import WalletExportToFileDialogContainer from '../../containers/wallet/settings/WalletExportToFileDialogContainer';
import WalletUnlockDialog from '../../components/wallet/WalletUnlockDialog';
import WalletUnlockDialogContainer from '../../containers/wallet/dialogs/WalletUnlockDialogContainer';
/* eslint-disable max-len */
// import ExportPaperWalletPrinterCopyDialog from './settings/paper-wallet-export-dialogs/ExportPaperWalletPrinterCopyDialog';
// import ExportPaperWalletPrinterCopyDialogContainer from '../../containers/wallet/dialogs/paper-wallet-export/ExportPaperWalletPrinterCopyDialogContainer';
// import ExportPaperWalletMnemonicDialog from './settings/paper-wallet-export-dialogs/ExportPaperWalletMnemonicDialog';
// import ExportPaperWalletMnemonicDialogContainer from '../../containers/wallet/dialogs/paper-wallet-export/ExportPaperWalletMnemonicDialogContainer';
// import ExportPaperWalletMnemonicVerificationDialog from './settings/paper-wallet-export-dialogs/ExportPaperWalletMnemonicVerificationDialog';
// import ExportPaperWalletMnemonicVerificationDialogContainer from '../../containers/wallet/dialogs/paper-wallet-export/ExportPaperWalletMnemonicVerificationDialogContainer';
// import ExportPaperWalletCertificateDialog from './settings/paper-wallet-export-dialogs/ExportPaperWalletCertificateDialog';
// import ExportPaperWalletCertificateDialogContainer from '../../containers/wallet/dialogs/paper-wallet-export/ExportPaperWalletCertificateDialogContainer';
/* eslint-disable max-len */
import type { ReactIntlMessage } from '../../types/i18nTypes';
import ChangeWalletPasswordDialog from './settings/ChangeWalletPasswordDialog';
import ChangeWalletPasswordDialogContainer from '../../containers/wallet/dialogs/ChangeWalletPasswordDialogContainer';
import globalMessages from '../../i18n/global-messages';
import styles from './WalletSettings.scss';

export const messages = defineMessages({
  name: {
    id: 'wallet.settings.name.label',
    defaultMessage: '!!!Name',
    description: 'Label for the "Name" text input on the wallet settings page.',
  },
  assuranceLevelLabel: {
    id: 'wallet.settings.assurance',
    defaultMessage: '!!!Transaction assurance security level',
    description: 'Label for the "Transaction assurance security level" dropdown.',
  },
  passwordLabel: {
    id: 'wallet.settings.password',
    defaultMessage: '!!!Password',
    description: 'Label for the "Password" field.',
  },
  passwordLastUpdated: {
    id: 'wallet.settings.passwordLastUpdated',
    defaultMessage: '!!!Last updated',
    description: 'Last updated X time ago message.',
  },
  passwordNotSet: {
    id: 'wallet.settings.passwordNotSet',
    defaultMessage: '!!!You still don\'t have password',
    description: 'You still don\'t have password set message.',
  },
  exportButtonLabel: {
    id: 'wallet.settings.exportWalletButtonLabel',
    defaultMessage: '!!!Export wallet',
    description: 'Label for the export button on wallet settings.',
  },
  unlockButtonLabel: {
    id: 'wallet.settings.unlockWallet',
    defaultMessage: '!!!Unlock',
    description: 'Label for the unlock button on wallet settings.'
  },
  lockButtonLabel: {
    id: 'wallet.settings.lockWallet',
    defaultMessage: '!!!Lock',
    description: 'Label for the lock button on wallet settings.'
  },
});

type Props = {
  assuranceLevels: Array<{ value: string, label: ReactIntlMessage }>,
  walletName: string,
  walletAssurance: string,
  isWalletPasswordSet: boolean,
  isWalletLocked: boolean,
  walletPasswordUpdateDate: ?Date,
  error?: ?LocalizableError,
  openDialogAction: Function,
  isDialogOpen: Function,
  onFieldValueChange: Function,
  onStartEditing: Function,
  onStopEditing: Function,
  onCancelEditing: Function,
  onUnlockWallet: Function,
  onLockWallet: Function,
  nameValidator: Function,
  activeField: ?string,
  isSubmitting: boolean,
  isInvalid: boolean,
  lastUpdatedField: ?string,
};

@observer
export default class WalletSettings extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  componentWillUnmount() {
    // This call is used to prevent display of old successfully-updated messages
    this.props.onCancelEditing();
  }

  render() {
    const { intl } = this.context;
    const {
      assuranceLevels, walletAssurance,
      walletName, isWalletPasswordSet,
      walletPasswordUpdateDate, error,
      openDialogAction, isDialogOpen,
      onFieldValueChange, onStartEditing,
      onStopEditing, onCancelEditing, 
      nameValidator, activeField,
      isSubmitting, isInvalid,
      lastUpdatedField,isWalletLocked,
      onUnlockWallet, onLockWallet
    } = this.props;

    const assuranceLevelOptions = assuranceLevels.map(assurance => ({
      value: assurance.value,
      label: intl.formatMessage(assurance.label),
    }));

    const passwordMessage = isWalletPasswordSet ? (
      intl.formatMessage(messages.passwordLastUpdated, {
        lastUpdated: moment(walletPasswordUpdateDate).fromNow(),
      })
    ) : intl.formatMessage(messages.passwordNotSet);

    const buttonClasses = classnames([
      'primary',
      styles.nextButton,
    ]);

    return (
      <div className={styles.component}>
	<div className={styles.categoryTitle}>
          Settings
        </div>
        <BorderedBox>



          <ReadOnlyInput
            label={intl.formatMessage(messages.passwordLabel)}
            value={passwordMessage}
            isSet={isWalletPasswordSet}
            onClick={() => openDialogAction({
              dialog: ChangeWalletPasswordDialog,
            })}
          />

          {/*
            <div className={styles.export}>
              <h2>Export</h2>
              <p>
                Use your wallet on multiple devices
                or give read-only copies to friends.
              </p>
              <button
                className={styles.export_link}
                onClick={() => openDialogAction({
                  dialog: WalletExportDialog
                })}
              >
                {intl.formatMessage(messages.exportButtonLabel)}
              </button>
            </div>
          */}

          {error && <p className={styles.error}>{intl.formatMessage(error)}</p>}

          {isWalletPasswordSet ? 
              <Button
                className={buttonClasses}
                label={isWalletLocked ? intl.formatMessage(messages.unlockButtonLabel) : intl.formatMessage(messages.lockButtonLabel)}
                onMouseUp={() => {
                  if(isWalletLocked)
                    openDialogAction({dialog: WalletUnlockDialog});
                  else
                    onLockWallet();
                }}
                skin={<SimpleButtonSkin />}
              />
            :
            null
          }
          
          
        </BorderedBox>

        {isDialogOpen(ChangeWalletPasswordDialog) ? (
          <ChangeWalletPasswordDialogContainer />
        ) : null}

        {isDialogOpen(RenameWalletConfirmationDialog) ? (
          <RenameWalletDialogContainer />
        ) : null}

        {isDialogOpen(WalletExportDialog) ? (
          <WalletExportToFileDialogContainer />
        ) : null}

        {isDialogOpen(WalletUnlockDialog) ? (
          <WalletUnlockDialogContainer
            actionType = 'unlock' 
            unlockWallet = {(password) => (
              onUnlockWallet(password)
            )}
          />
        ) : null}

        {/*
          {isDialogOpen(ExportPaperWalletPrinterCopyDialog) ? (
            <ExportPaperWalletPrinterCopyDialogContainer />
          ) : null}

          {isDialogOpen(ExportPaperWalletMnemonicDialog) ? (
            <ExportPaperWalletMnemonicDialogContainer />
          ) : null}

          {isDialogOpen(ExportPaperWalletMnemonicVerificationDialog) ? (
            <ExportPaperWalletMnemonicVerificationDialogContainer />
          ) : null}

          {isDialogOpen(ExportPaperWalletCertificateDialog) ? (
            <ExportPaperWalletCertificateDialogContainer />
          ) : null}
        */}

      </div>
    );
  }

}
