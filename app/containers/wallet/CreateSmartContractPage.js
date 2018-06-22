// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import CreateSmartContract from '../../components/wallet/smartcontracts/CreateSmartContract';
import type { InjectedProps } from '../../types/injectedPropsType';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class CreateSmartContractPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { uiDialogs } = this.props.stores;
    const { intl } = this.context;
    const actions = this.props.actions;
    const { contracts } = this.props.stores.lux;
    const { createContract, createLuxContractRequest, saveContract, bytecode, abi, gaslimit, gasprice, senderaddress} = contracts;

    return (
      <CreateSmartContract
        createContract={(bytecode, gasLimit, gasPrice, senderaddress) => (
          createContract({bytecode: bytecode, gasLimit: gasLimit, gasPrice: gasPrice, senderaddress: senderaddress})
        )}
        saveContract={(bytecode, abi, gaslimit, gasprice, senderaddress) => (
          saveContract({bytecode: bytecode, abi: abi, gaslimit: gaslimit, gasprice: gasprice, senderaddress: senderaddress})
        )}
        bytecode={bytecode}
        abi={abi}
        gaslimit={gaslimit}
        gasprice={gasprice}
        senderaddress={senderaddress}
        error={createLuxContractRequest.error}
        openDialogAction={actions.dialogs.open.trigger}  
        isDialogOpen={uiDialogs.isOpen}
      />
    );
  }

}
