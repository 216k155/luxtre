// @flow
import Action from '../lib/Action';
import type { RedemptionTypeChoices } from '../../types/redemptionTypes';

// ======= LUX REDEMPTION ACTIONS =======

export default class LuxRedemptionActions {
  chooseRedemptionType: Action<{ redemptionType: RedemptionTypeChoices }> = new Action();
  setCertificate: Action<{ certificate: File }> = new Action();
  removeCertificate: Action<any> = new Action();
  setPassPhrase: Action<{ passPhrase: string }> = new Action();
  setRedemptionCode: Action<{ redemptionCode: string }> = new Action();
  setEmail: Action<{ email: string }> = new Action();
  setLuxPasscode: Action<{ luxPasscode: string }> = new Action();
  setLuxAmount: Action<{ luxAmount: string }> = new Action();
  redeemLux: Action<{ walletId: string, walletPassword: ?string }> = new Action();
  // eslint-disable-next-line max-len
  redeemPaperVendedLux: Action<{ walletId: string, shieldedRedemptionKey: string, walletPassword: ?string }> = new Action();
  luxSuccessfullyRedeemed: Action<any> = new Action();
  acceptRedemptionDisclaimer: Action<any> = new Action();
  // TODO: refactor dialog toggles to use dialog-actions instead
  closeLuxRedemptionSuccessOverlay: Action<any> = new Action();
}
