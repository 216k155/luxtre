// @flow
import { observable, action } from 'mobx';
import _ from 'lodash';
import WalletSettingsStore from '../WalletSettingsStore';
import Request from '../lib/LocalizedRequest';
import type { WalletExportToFileParams } from '../../actions/lux/wallet-settings-actions';
import type { ExportWalletToFileResponse } from '../../api/lux/index';
import type { 
  UpdateWalletPasswordResponse, 
  UpdateWalletResponse,
  UnlockWalletResponse,
  LockWalletResponse
 } from '../../api/common';

export default class LuxWalletSettingsStore extends WalletSettingsStore {

  /* eslint-disable max-len */
  @observable updateWalletRequest: Request<UpdateWalletResponse> = new Request(this.api.lux.updateWallet);
  @observable updateWalletPasswordRequest: Request<UpdateWalletPasswordResponse> = new Request(this.api.lux.updateWalletPassword);
  @observable exportWalletToFileRequest: Request<ExportWalletToFileResponse> = new Request(this.api.lux.exportWalletToFile);
  @observable unlockWalletRequest: Request<UnlockWalletResponse> = new Request(this.api.lux.unlockWallet);
  @observable lockWalletRequest: Request<LockWalletResponse> = new Request(this.api.lux.lockWallet);
  /* eslint-enable max-len */

  setup() {
    const a = this.actions.lux.walletSettings;
    a.startEditingWalletField.listen(this._startEditingWalletField);
    a.stopEditingWalletField.listen(this._stopEditingWalletField);
    a.cancelEditingWalletField.listen(this._cancelEditingWalletField);
    a.updateWalletField.listen(this._updateWalletField);
    a.updateWalletPassword.listen(this._updateWalletPassword);
    a.exportToFile.listen(this._exportToFile);
    a.unlockWallet.listen(this._unlockWallet);
    a.lockWallet.listen(this._lockWallet);
  }

  @action _updateWalletPassword = async ({ walletId, oldPassword, newPassword }: {
    walletId: string, oldPassword: ?string, newPassword: ?string,
  }) => {
    await this.updateWalletPasswordRequest.execute({ walletId, oldPassword, newPassword });
    this.actions.dialogs.closeActiveDialog.trigger();
    this.updateWalletPasswordRequest.reset();
    this.stores.lux.wallets.refreshWalletsData();
  };

  @action _updateWalletField = async ({ field, value }: { field: string, value: string }) => {
    const activeWallet = this.stores.lux.wallets.active;
    if (!activeWallet) return;
    const { id: walletId, name, assurance } = activeWallet;
    const walletData = { walletId, name, assurance };
    walletData[field] = value;
    const wallet = await this.updateWalletRequest.execute(walletData).promise;
    if (!wallet) return;
    await this.stores.lux.wallets.walletsRequest.patch(result => {
      const walletIndex = _.findIndex(result, { id: walletId });
      result[walletIndex] = wallet;
    });
    this.stores.lux.wallets._setActiveWallet({ walletId });
  };

  @action _exportToFile = async (params: WalletExportToFileParams) => {
    const { walletId, filePath, password } = params;
    await this.exportWalletToFileRequest.execute({ walletId, filePath, password });
    this.actions.dialogs.closeActiveDialog.trigger();
  }

  @action _unlockWallet = async ({ password }: { password: string }) => {
    const result = await this.unlockWalletRequest.execute({password}).promise;
    if (!result) throw new Error('Wallet was not unlocked correctly');
    this.actions.dialogs.closeActiveDialog.trigger();
    this.unlockWalletRequest.reset();
    this.stores.lux.wallets.refreshWalletsData();
  }

  @action _lockWallet = async () => {
    const result = await this.lockWalletRequest.execute().promise;
    if (!result) throw new Error('Wallet was not locked correctly');
    this.lockWalletRequest.reset();
    this.stores.lux.wallets.refreshWalletsData();
  }
}
