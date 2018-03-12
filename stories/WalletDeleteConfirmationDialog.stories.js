import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import StoryDecorator from './support/StoryDecorator';
import RenameWalletConfirmationDialog from '../app/components/wallet/settings/RenameWalletConfirmationDialog';

storiesOf('RenameWalletConfirmationDialog', module)

  .addDecorator((story) => (
    <StoryDecorator>
      {story()}
    </StoryDecorator>
  ))

  // ====== Stories ======

  .add('without funds & countdown', () => (
    <div>
      <RenameWalletConfirmationDialog
        walletName={"My Wallet"}
        hasWalletFunds={false}
        countdownFn={() => 10}
        isBackupNoticeAccepted={false}
      />
    </div>
  ))
  .add('without funds - not accepted', () => (
    <div>
      <RenameWalletConfirmationDialog
        walletName={"My Wallet"}
        hasWalletFunds={false}
        countdownFn={() => 0}
        isBackupNoticeAccepted={false}
      />
    </div>
  ))
  .add('without funds - accepted', () => (
    <div>
      <RenameWalletConfirmationDialog
        walletName={"My Wallet"}
        hasWalletFunds={false}
        countdownFn={() => 0}
        isBackupNoticeAccepted={true}
      />
    </div>
  ))
  .add('funds & countdown', () => (
    <div>
      <RenameWalletConfirmationDialog
        walletName={"My Wallet"}
        hasWalletFunds={true}
        countdownFn={() => 10}
        isBackupNoticeAccepted={false}
      />
    </div>
  ))
  .add('funds & accepted', () => (
    <div>
      <RenameWalletConfirmationDialog
        walletName={"My Wallet"}
        hasWalletFunds={true}
        countdownFn={() => 0}
        isBackupNoticeAccepted={true}
      />
    </div>
  ))
  .add('funds & accepted & filled', () => (
    <div>
      <RenameWalletConfirmationDialog
        walletName={"My Wallet"}
        hasWalletFunds={true}
        countdownFn={() => 0}
        isBackupNoticeAccepted={true}
        confirmationValue="babushka"
        onConfirmationValueChange={action('onRecoveryWordChange')}
      />
    </div>
  ));

