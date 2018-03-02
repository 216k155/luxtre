// @flow
import { action, observable, runInAction } from 'mobx';
import { ipcRenderer } from 'electron';
import { isString } from 'lodash';
import Store from '../lib/Store';
import Request from '../lib/LocalizedRequest';
import { Logger } from '../../utils/logging';
import { matchRoute } from '../../utils/routing';
import WalletTransaction from '../../domain/WalletTransaction';
import { PARSE_REDEMPTION_CODE } from '../../../electron/ipc-api/parse-redemption-code-from-pdf';
import {
  InvalidMnemonicError,
  LuxRedemptionCertificateParseError,
  LuxRedemptionEncryptedCertificateParseError
} from '../../i18n/errors';
import { DECIMAL_PLACES_IN_LUX } from '../../config/numbersConfig';
import LocalizableError from '../../i18n/LocalizableError';
import Wallet from '../../domain/Wallet';
import { ROUTES } from '../../routes-config';
import type { RedeemPaperVendedLuxResponse } from '../../api/lux/index';
import type { RedemptionTypeChoices } from '../../types/redemptionTypes';

export default class LuxRedemptionStore extends Store {

  @observable redemptionType: RedemptionTypeChoices = 'regular';
  @observable certificate: ?File = null;
  @observable isCertificateEncrypted = false;
  @observable passPhrase: ?string = null;
  @observable shieldedRedemptionKey: ?string = null;
  @observable email: ?string = null;
  @observable luxPasscode: ?string = null;
  @observable luxAmount: ?string = null;
  @observable redemptionCode: string = '';
  @observable walletId: ?string = null;
  @observable error: ?LocalizableError = null;
  @observable amountRedeemed: number = 0;
  @observable showLuxRedemptionSuccessMessage: boolean = false;
  @observable redeemLuxRequest: Request<Wallet> = new Request(this.api.lux.redeemLux);
  // eslint-disable-next-line
  @observable redeemPaperVendedLuxRequest: Request<RedeemPaperVendedLuxResponse> = new Request(this.api.lux.redeemPaperVendedLux);
  @observable isRedemptionDisclaimerAccepted = false;

  setup() {
    const actions = this.actions.lux.luxRedemption;
    actions.chooseRedemptionType.listen(this._chooseRedemptionType);
    actions.setCertificate.listen(this._setCertificate);
    actions.setPassPhrase.listen(this._setPassPhrase);
    actions.setRedemptionCode.listen(this._setRedemptionCode);
    actions.setEmail.listen(this._setEmail);
    actions.setLuxPasscode.listen(this._setLuxPasscode);
    actions.setLuxAmount.listen(this._setLuxAmount);
    actions.redeemLux.listen(this._redeemLux);
    actions.redeemPaperVendedLux.listen(this._redeemPaperVendedLux);
    actions.luxSuccessfullyRedeemed.listen(this._onLuxSuccessfullyRedeemed);
    actions.closeLuxRedemptionSuccessOverlay.listen(this._onCloseLuxRedemptionSuccessOverlay);
    actions.removeCertificate.listen(this._onRemoveCertificate);
    actions.acceptRedemptionDisclaimer.listen(this._onAcceptRedemptionDisclaimer);
    ipcRenderer.on(PARSE_REDEMPTION_CODE.SUCCESS, this._onCodeParsed);
    ipcRenderer.on(PARSE_REDEMPTION_CODE.ERROR, this._onParseError);
    this.registerReactions([
      this._resetRedemptionFormValuesOnLuxRedemptionPageLoad,
    ]);
  }

  teardown() {
    super.teardown();
    ipcRenderer.removeAllListeners(PARSE_REDEMPTION_CODE.SUCCESS);
    ipcRenderer.removeAllListeners(PARSE_REDEMPTION_CODE.ERROR);
  }

  isValidRedemptionKey = (redemptionKey: string) => (
    this.api.lux.isValidRedemptionKey(redemptionKey)
  );

  isValidRedemptionMnemonic = (mnemonic: string) => (
    this.api.lux.isValidRedemptionMnemonic(mnemonic)
  );

  isValidPaperVendRedemptionKey = (
    mnemonic: string
  ) => this.api.lux.isValidPaperVendRedemptionKey(mnemonic);

  @action _chooseRedemptionType = (params: {
    redemptionType: RedemptionTypeChoices,
  }) => {
    if (this.redemptionType !== params.redemptionType) {
      this._reset();
      this.redemptionType = params.redemptionType;
    }
  };

  _onAcceptRedemptionDisclaimer = action(() => {
    this.isRedemptionDisclaimerAccepted = true;
  });

  _setCertificate = action(({ certificate }) => {
    this.certificate = certificate;
    this.isCertificateEncrypted = certificate.type !== 'application/pdf';
    if (this.isCertificateEncrypted && !this.passPhrase) {
      this.redemptionCode = '';
      this.passPhrase = null;
      return; // We cannot decrypt it yet!
    }
    this._parseCodeFromCertificate();
  });

  _setPassPhrase = action(({ passPhrase } : { passPhrase: string }) => {
    this.passPhrase = passPhrase;
    if (this.isValidRedemptionMnemonic(passPhrase)) this._parseCodeFromCertificate();
  });

  _setRedemptionCode = action(({ redemptionCode } : { redemptionCode: string }) => {
    this.redemptionCode = redemptionCode;
  });

  _setEmail = action(({ email } : { email: string }) => {
    this.email = email;
    this._parseCodeFromCertificate();
  });

  _setLuxPasscode = action(({ luxPasscode } : { luxPasscode: string }) => {
    this.luxPasscode = luxPasscode;
    this._parseCodeFromCertificate();
  });

  _setLuxAmount = action(({ luxAmount } : { luxAmount: string }) => {
    this.luxAmount = luxAmount;
    this._parseCodeFromCertificate();
  });

  _parseCodeFromCertificate() {
    if (this.redemptionType === 'regular') {
      if (!this.passPhrase && this.isCertificateEncrypted) return;
    }
    if (this.redemptionType === 'forceVended') {
      if ((!this.email || !this.luxAmount || !this.luxPasscode) && this.isCertificateEncrypted) {
        return;
      }
    }
    if (this.redemptionType === 'paperVended') return;
    if (this.certificate == null) throw new Error('Certificate File is required for parsing.');
    const path = this.certificate.path; // eslint-disable-line
    Logger.debug('Parsing LUX Redemption code from certificate: ' + path);
    let decryptionKey = null;
    if (this.redemptionType === 'regular' && this.isCertificateEncrypted) {
      decryptionKey = this.passPhrase;
    }
    if (this.redemptionType === 'forceVended' && this.isCertificateEncrypted) {
      decryptionKey = [this.email, this.luxPasscode, this.luxAmount];
    }
    ipcRenderer.send(PARSE_REDEMPTION_CODE.REQUEST, path, decryptionKey, this.redemptionType);
  }

  _onCodeParsed = action((event, code) => {
    Logger.debug('Redemption code parsed from certificate: ' + code);
    this.redemptionCode = code;
  });

  _onParseError = action((event, error) => {
    const errorMessage = isString(error) ? error : error.message;
    if (errorMessage.includes('Invalid mnemonic')) {
      this.error = new InvalidMnemonicError();
    } else if (this.redemptionType === 'regular') {
      if (this.isCertificateEncrypted) {
        this.error = new LuxRedemptionEncryptedCertificateParseError();
      } else {
        this.error = new LuxRedemptionCertificateParseError();
      }
    }
    this.redemptionCode = '';
    this.passPhrase = null;
  });

  _redeemLux = async ({ walletId, walletPassword } : {
    walletId: string,
    walletPassword: ?string,
  }) => {
    runInAction(() => {
      this.walletId = walletId;
    });
    const accountId = this.stores.lux.addresses._getAccountIdByWalletId(walletId);
    if (!accountId) throw new Error('Active account required before redeeming Lux.');

    this.redeemLuxRequest.execute({
      redemptionCode: this.redemptionCode,
      accountId,
      walletPassword
    })
      .then(action((transaction: WalletTransaction) => {
        this._reset();
        this.actions.lux.luxRedemption.luxSuccessfullyRedeemed.trigger({
          walletId,
          amount: transaction.amount.toFormat(DECIMAL_PLACES_IN_LUX),
        });
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  };

  _redeemPaperVendedLux = action(({ walletId, shieldedRedemptionKey, walletPassword } : {
    walletId: string,
    shieldedRedemptionKey: string,
    walletPassword: ?string,
  }) => {
    this.walletId = walletId;
    const accountId = this.stores.lux.addresses._getAccountIdByWalletId(walletId);
    if (!accountId) throw new Error('Active account required before redeeming Lux.');
    this.redeemPaperVendedLuxRequest.execute({
      shieldedRedemptionKey,
      mnemonics: this.passPhrase,
      accountId,
      walletPassword,
    })
      .then(action((transaction: WalletTransaction) => {
        this._reset();
        this.actions.lux.luxRedemption.luxSuccessfullyRedeemed.trigger({
          walletId,
          amount: transaction.amount.toFormat(DECIMAL_PLACES_IN_LUX),
        });
      }))
      .catch(action((error) => {
        this.error = error;
      }));
  });

  _onLuxSuccessfullyRedeemed = action(({ walletId, amount }) => {
    Logger.debug('LUX successfully redeemed for wallet: ' + walletId);
    this.stores.lux.wallets.goToWalletRoute(walletId);
    this.amountRedeemed = amount;
    this.showLuxRedemptionSuccessMessage = true;
    this.redemptionCode = '';
    this.passPhrase = null;
  });

  _onCloseLuxRedemptionSuccessOverlay = action(() => {
    this.showLuxRedemptionSuccessMessage = false;
  });

  _resetRedemptionFormValuesOnLuxRedemptionPageLoad = () => {
    const currentRoute = this.stores.app.currentRoute;
    const match = matchRoute(ROUTES.LUX_REDEMPTION, currentRoute);
    if (match) this._reset();
  }

  _onRemoveCertificate = action(() => {
    this.error = null;
    this.certificate = null;
    this.redemptionCode = '';
    this.passPhrase = null;
    this.email = null;
    this.luxPasscode = null;
    this.luxAmount = null;
  });

  @action _reset = () => {
    this.error = null;
    this.certificate = null;
    this.isCertificateEncrypted = false;
    this.walletId = null;
    this.redemptionType = 'regular';
    this.redemptionCode = '';
    this.shieldedRedemptionKey = null;
    this.passPhrase = null;
    this.email = null;
    this.luxPasscode = null;
    this.luxAmount = null;
  };

}
