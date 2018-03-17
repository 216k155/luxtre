// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import NoMasternodes from '../../components/wallet/masternodes/NoMasternodes';
import MasternodesList from '../../components/wallet/masternodes/MasternodesList';
import type { InjectedProps } from '../../types/injectedPropsType';
import VerticalFlexContainer from '../../components/layout/VerticalFlexContainer';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class MasternodesNetPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { intl } = this.context;
    const actions = this.props.actions;
    const { masternodes} = this.props.stores.lux;
    const { totalActivated, masternodeslist } = masternodes;

    //console.log(masternodeslist);
    // Guard against potential null values
    //if (!searchOptions || !activeWallet) return null;

  //  const { searchLimit, searchTerm } = searchOptions;
  //  const wasSearched = searchTerm !== '';
  //  const noActiveLabel = intl.formatMessage(messages.noTransactions);
  //  const noTransactionsFoundLabel = intl.formatMessage(messages.noTransactionsFound);

    // Guard against potential null values
//    if (!hasAny) {
//    const masternodesnet = <MasternodeNoActives label='aaaaaaaaaaaaaaaaaaaaaaaa' />;
    const masternodesnet = <MasternodesList/>;
//    }
    return (
      <MasternodesList
        masternodes = {masternodeslist}
        totalActivated = {totalActivated} 
      />
    );
  }

}
