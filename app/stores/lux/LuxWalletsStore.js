// @flow
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';
import WalletStore from '../WalletStore';
import Request from '.././lib/LocalizedRequest';
import type {
  GetEstimatedGasPriceResponse,
} from '../../api/lux/index';
import type {
  CreateWalletResponse, GetWalletsResponse,
  DeleteWalletResponse, RestoreWalletResponse,
  CreateTransactionResponse, GetWalletRecoveryPhraseResponse
} from '../../api/common';
import { LUX_DEFAULT_GAS_PRICE } from '../../config/numbersConfig';

export default class LuxWalletsStore extends WalletStore {

  // REQUESTS
  /* eslint-disable max-len */
  @observable walletsRequest: Request<GetWalletsResponse> = new Request(this.api.lux.getWallets);
  @observable createWalletRequest: Request<CreateWalletResponse> = new Request(this.api.lux.createWallet);
  @observable deleteWalletRequest: Request<DeleteWalletResponse> = new Request(this.api.lux.deleteWallet);
  @observable sendMoneyRequest: Request<CreateTransactionResponse> = new Request(this.api.lux.createTransaction);
  @observable getEstimatedGasPriceRequest: Request<GetEstimatedGasPriceResponse> = new Request(this.api.lux.getEstimatedGasPriceResponse);
  @observable getWalletRecoveryPhraseRequest: Request<GetWalletRecoveryPhraseResponse> = new Request(this.api.lux.getWalletRecoveryPhrase);
  @observable restoreRequest: Request<RestoreWalletResponse> = new Request(this.api.lux.restoreWallet);
  /* eslint-disable max-len */

  setup() {
    super.setup();
    const { walletBackup, lux } = this.actions;
    const { wallets } = lux;
    wallets.createWallet.listen(this._create);
    wallets.deleteWallet.listen(this._delete);
    wallets.sendMoney.listen(this._sendMoney);
    wallets.restoreWallet.listen(this._restore);
    walletBackup.finishWalletBackup.listen(this._finishCreation);
  }

  _sendMoney = async (transactionDetails: {
    receiver: string,
    amount: string,
    password: ?string,
  }) => {
    const wallet = this.active;
    if (!wallet) throw new Error('Active wallet required before sending.');
    const { receiver, amount, password } = transactionDetails;
    await this.sendMoneyRequest.execute({
      from: wallet.id,
      to: receiver,
      value: new BigNumber(amount),
      password: password != null ? password : '',
      gasPrice: LUX_DEFAULT_GAS_PRICE,
    });
    this.refreshWalletsData();
    this.actions.dialogs.closeActiveDialog.trigger();
    this.sendMoneyRequest.reset();
    this.goToWalletRoute(wallet.id);
  };

  calculateTransactionFee = async (transactionDetails: {
    sender: string,
    receiver: string,
    amount: string,
  }) => {
    const { sender, receiver, amount } = transactionDetails;
    return await this.getEstimatedGasPriceRequest.execute({
      from: sender,
      to: receiver,
      value: new BigNumber(amount),
      gasPrice: LUX_DEFAULT_GAS_PRICE,
    });
  };

  isValidMnemonic = (mnemonic: string) => this.api.lux.isValidMnemonic(mnemonic);

  isValidAddress = (address: string) => this.api.lux.isValidAddress(address);

  isValidAmount = (amount: string) => !(new BigNumber(amount).isNegative());
}
