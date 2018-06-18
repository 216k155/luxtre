// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import SendtoSmartContract from '../../components/wallet/smartcontracts/SendtoSmartContract';
import type { InjectedProps } from '../../types/injectedPropsType';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class SendtoSmartContractPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { uiDialogs } = this.props.stores;
    const { intl } = this.context;
    const actions = this.props.actions;
    const { contracts } = this.props.stores.lux;
    const { sendToContract, sendToLuxContractRequest } = contracts;

    return (
      <SendtoSmartContract
        sendToContract={(contractaddress, datahex, amount, gasLimit, gasPrice, senderaddress) => (
          sendToContract({contractaddress: contractaddress, datahex: datahex, amount: amount, gasLimit: gasLimit, gasPrice: gasPrice, senderaddress: senderaddress})
        )}
        error={sendToLuxContractRequest.error}
        openDialogAction={actions.dialogs.open.trigger}  
        isDialogOpen={uiDialogs.isOpen}
      />
    );
  }

}
