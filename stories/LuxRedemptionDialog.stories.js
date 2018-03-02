import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import StoryDecorator from './support/StoryDecorator';
import LuxRedemptionForm from '../app/components/wallet/lux-redemption/LuxRedemptionForm';
import LuxRedemptionChoices from '../app/components/wallet/lux-redemption/LuxRedemptionChoices';

storiesOf('LuxRedemptionForm', module)

  .addDecorator((story) => (
    <StoryDecorator>
      {story()}
    </StoryDecorator>
  ))

  // ====== Stories ======

  .add('Lux redemption choices', () => (
    <div>
      <LuxRedemptionChoices
        activeChoice="forceVended"
        onSelectChoice={action('selectChoice')}
      />
    </div>
  ))

  .add('Certificate not selected', () => (
    <div>
      <LuxRedemptionForm
        onSubmit={action('submit')}
        isSubmitting={false}
        isRedemptionDisclaimerAccepted={true}
        isCertificateSelected={false}
        isCertificateEncrypted={false}
        onCertificateSelected={action('onCertificateSelected')}
        onPassPhraseChanged={action('onPassPhraseChanged')}
        onRedemptionCodeChanged={action('onRedemptionCodeChanged')}
        onChooseRedemptionType={action('onChooseRedemptionType')}
        redemptionCode=''
        redemptionType='regular'
        getSelectedWallet={() => ({})}
        wallets={[
          { value: 'wallet-1', label: 'First Wallet' },
          { value: 'wallet-2', label: 'Second Wallet' },
          { value: 'wallet-3', label: 'Third Wallet' },
        ]}
      />
    </div>
  ))

  .add('Certificate selected - not encrypted', () => (
    <div>
      <LuxRedemptionForm
        onSubmit={action('submit')}
        isSubmitting={false}
        isRedemptionDisclaimerAccepted={true}
        isCertificateSelected={true}
        isCertificateEncrypted={false}
        onCertificateSelected={action('onCertificateSelected')}
        onPassPhraseChanged={action('onPassPhraseChanged')}
        onRedemptionCodeChanged={action('onRedemptionCodeChanged')}
        onChooseRedemptionType={action('onChooseRedemptionType')}
        redemptionCode=''
        redemptionType='regular'
        getSelectedWallet={() => ({})}
        wallets={[
          { value: 'wallet-1', label: 'First Wallet' },
          { value: 'wallet-2', label: 'Second Wallet' },
          { value: 'wallet-3', label: 'Third Wallet' },
        ]}
      />
    </div>
  ))

  .add('Certificate selected - encrypted', () => (
    <div>
      <LuxRedemptionForm
        onSubmit={action('submit')}
        isSubmitting={false}
        isRedemptionDisclaimerAccepted={true}
        isCertificateSelected={true}
        isCertificateEncrypted={true}
        onCertificateSelected={action('onCertificateSelected')}
        onPassPhraseChanged={action('onPassPhraseChanged')}
        onRedemptionCodeChanged={action('onRedemptionCodeChanged')}
        onChooseRedemptionType={action('onChooseRedemptionType')}
        redemptionCode=''
        redemptionType='regular'
        getSelectedWallet={() => ({})}
        wallets={[
          { value: 'wallet-1', label: 'First Wallet' },
          { value: 'wallet-2', label: 'Second Wallet' },
          { value: 'wallet-3', label: 'Third Wallet' },
        ]}
      />
    </div>
  ));
