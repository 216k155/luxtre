// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import PosCalculator from '../../components/wallet/utilities/PosCalculator';
import type { InjectedProps } from '../../types/injectedPropsType';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class UtilityPosCalcPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { intl } = this.context;
    const actions = this.props.actions;
    const { masternodes} = this.props.stores.lux;
    const { totalActivated, masternodeslist } = masternodes;

    const coinCount = 100;
    const txAge = 20;
    const posDifficulty = 4;

    return (
      <PosCalculator
        numberOfCoinsStart = {coinCount}
        ageOfTransaction = {txAge} 
        posDifficulty = {posDifficulty} 
      />
    );
  }

}
