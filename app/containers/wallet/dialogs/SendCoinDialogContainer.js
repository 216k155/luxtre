// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import SendCoinDialog from '../../../components/exchange/SendCoinDialog';
import type { InjectedProps } from '../../../types/injectedPropsType';
import { DECIMAL_PLACES_IN_LUX, MAX_INTEGER_PLACES_IN_LUX } from '../../../config/numbersConfig';
type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  coinName: string,
  balance: string
};

@inject('actions', 'stores') @observer
export default class SendCoinDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  handleLuxgateSendFormSubmit = (values: Object) => {
    this.props.actions.luxgate.coinInfo.sendCoin.trigger(values);
  };

  render() {
    const { actions, coinName, balance} = this.props;
    const { coinInfo } = this.props.stores.luxgate;
    const { sendCoinRequest } = coinInfo;

    return (
      <SendCoinDialog
        currencyMaxIntegerDigits={MAX_INTEGER_PLACES_IN_LUX}
        currencyMaxFractionalDigits={DECIMAL_PLACES_IN_LUX}
        coinName = {coinName}
        balance = {balance}
        onSubmit={this.handleLuxgateSendFormSubmit}
        isSubmitting={sendCoinRequest.isExecuting}
        error = {sendCoinRequest.error}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
        }}
      >
      </SendCoinDialog>
    );
  }

}
