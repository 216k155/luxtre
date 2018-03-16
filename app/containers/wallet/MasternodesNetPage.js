// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import MasternodeNoActives from '../../components/wallet/masternodes/MasternodeNoActives';
import MasternodeActivates from '../../components/wallet/masternodes/MasternodeActivates';
import type { InjectedProps } from '../../types/injectedPropsType';
import VerticalFlexContainer from '../../components/layout/VerticalFlexContainer';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class MasternodesNetPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { intl } = this.context;
    const actions = this.props.actions;
    const { masternodes, wallets } = this.props.stores.lux;
    const activeWallet = wallets.active;
    //const { searchOptions, hasAny, totalAvailable, filtered } = masternodes;

    // Guard against potential null values
    //if (!searchOptions || !activeWallet) return null;

  //  const { searchLimit, searchTerm } = searchOptions;
  //  const wasSearched = searchTerm !== '';
  //  const noActiveLabel = intl.formatMessage(messages.noTransactions);
  //  const noTransactionsFoundLabel = intl.formatMessage(messages.noTransactionsFound);

    // Guard against potential null values
//    if (!hasAny) {
//    const masternetlist = <MasternodeNoActives label='aaaaaaaaaaaaaaaaaaaaaaaa' />;
    const masternetlist = <MasternodeActivates/>;
//    }
    return (
      <MasternodeActivates/>
    );
  }

}
