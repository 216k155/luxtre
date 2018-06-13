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
    const { intl } = this.context;
    const actions = this.props.actions;

    return (
      <CreateSmartContract/>
    );
  }

}
