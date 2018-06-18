// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import CallSmartContract from '../../components/wallet/smartcontracts/CallSmartContract';
import type { InjectedProps } from '../../types/injectedPropsType';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class CallSmartContractPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { intl } = this.context;
    const actions = this.props.actions;
    const { contracts, } = this.props.stores.lux;
    const { callLuxContractRequest } = contracts;

    return (
      <CallSmartContract
        callContract={(address, data, senderaddress, gasLimit) => (
          actions.contracts.callContracts.trigger({
            address: address,
            data: data,
            senderaddress: senderaddress
          })
        )}
        error={callLuxContractRequest.error}
      />
    );
  }

}
