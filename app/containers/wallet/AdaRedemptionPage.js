// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Layout from '../MainLayout';
import LuxRedemptionForm from '../../components/wallet/lux-redemption/LuxRedemptionForm';
import LoadingSpinner from '../../components/widgets/LoadingSpinner';
import { LuxRedemptionCertificateParseError } from '../../i18n/errors';
import type { InjectedProps } from '../../types/injectedPropsType';
import validWords from '../../../lib/valid-words.en';
import environment from '../../environment';

type Props = InjectedProps;

@inject('stores', 'actions') @observer
export default class LuxRedemptionPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  onSubmit = (values: { walletId: string, walletPassword: ?string }) => {
    this.props.actions.lux.luxRedemption.redeemLux.trigger(values);
  };

  onSubmitPaperVended = (values: {
    walletId: string,
    shieldedRedemptionKey: string,
    walletPassword: ?string,
  }) => {
    this.props.actions.lux.luxRedemption.redeemPaperVendedLux.trigger(values);
  };

  render() {
    const { wallets, luxRedemption } = this.props.stores.lux;
    const {
      redeemLuxRequest, redeemPaperVendedLuxRequest, isCertificateEncrypted, isValidRedemptionKey,
      redemptionType, isValidRedemptionMnemonic, isValidPaperVendRedemptionKey,
      isRedemptionDisclaimerAccepted, error
    } = luxRedemption;
    const {
      chooseRedemptionType, setCertificate, setPassPhrase, setRedemptionCode, removeCertificate,
      setEmail, setLuxPasscode, setLuxAmount, acceptRedemptionDisclaimer
    } = this.props.actions.lux.luxRedemption;
    const selectableWallets = wallets.all.map((w) => ({
      value: w.id, label: w.name
    }));

    if (selectableWallets.length === 0) return <Layout><LoadingSpinner /></Layout>;
    const request = redemptionType === 'paperVended' ? redeemPaperVendedLuxRequest : redeemLuxRequest;
    const isCertificateSelected = luxRedemption.certificate !== null;
    const showInputsForDecryptingForceVendedCertificate = isCertificateSelected &&
      isCertificateEncrypted && redemptionType === 'forceVended';
    const showPassPhraseWidget = isCertificateSelected && isCertificateEncrypted &&
      redemptionType === 'regular' || redemptionType === 'paperVended';
    return (
      <Layout>
        <LuxRedemptionForm
          onCertificateSelected={(certificate) => setCertificate.trigger({ certificate })}
          onPassPhraseChanged={(passPhrase) => setPassPhrase.trigger({ passPhrase })}
          onRedemptionCodeChanged={(redemptionCode) => {
            setRedemptionCode.trigger({ redemptionCode });
          }}
          onEmailChanged={(email) => setEmail.trigger({ email })}
          onLuxAmountChanged={(luxAmount) => setLuxAmount.trigger({ luxAmount })}
          onLuxPasscodeChanged={(luxPasscode) => setLuxPasscode.trigger({ luxPasscode })}
          onChooseRedemptionType={(choice) => {
            chooseRedemptionType.trigger({ redemptionType: choice });
          }}
          redemptionCode={luxRedemption.redemptionCode}
          wallets={selectableWallets}
          suggestedMnemonics={validWords}
          isCertificateSelected={isCertificateSelected}
          isCertificateEncrypted={isCertificateEncrypted}
          isCertificateInvalid={error instanceof LuxRedemptionCertificateParseError}
          isSubmitting={request.isExecuting}
          error={luxRedemption.error}
          onRemoveCertificate={removeCertificate.trigger}
          onSubmit={redemptionType === 'paperVended' ? this.onSubmitPaperVended : this.onSubmit}
          mnemonicValidator={isValidRedemptionMnemonic}
          redemptionCodeValidator={isValidRedemptionKey}
          postVendRedemptionCodeValidator={isValidPaperVendRedemptionKey}
          redemptionType={redemptionType}
          showInputsForDecryptingForceVendedCertificate={
            showInputsForDecryptingForceVendedCertificate
          }
          showPassPhraseWidget={showPassPhraseWidget}
          isRedemptionDisclaimerAccepted={environment.isMainnet() || isRedemptionDisclaimerAccepted}
          onAcceptRedemptionDisclaimer={() => acceptRedemptionDisclaimer.trigger()}
          getSelectedWallet={walletId => wallets.getWalletById(walletId)}
        />
      </Layout>
    );
  }
}
