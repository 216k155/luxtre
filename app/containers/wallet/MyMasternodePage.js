// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import NoMasternodes from '../../components/wallet/masternodes/NoMasternodes';
import Masternode from '../../components/wallet/masternodes/Masternode';
import type { InjectedProps } from '../../types/injectedPropsType';
import VerticalFlexContainer from '../../components/layout/VerticalFlexContainer';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class MyMasternodePage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { uiDialogs } = this.props.stores;
    const { intl } = this.context;
    const actions = this.props.actions;
    const { masternodes} = this.props.stores.lux;
    const { myMasternodeList } = masternodes;

    // Guard against potential null values
    //if (!searchOptions || !activeWallet) return null;

  //  const { searchLimit, searchTerm } = searchOptions;
  //  const wasSearched = searchTerm !== '';
    //const noActiveLabel = intl.formatMessage(messages.noTransactions);
  //  const noTransactionsFoundLabel = intl.formatMessage(messages.noTransactionsFound);

    // Guard against potential null values
//    if (!hasAny) {
      const mymasternode = <Masternode label="aaaaaaaaaaaaa" />;
//    }
    return (
      <Masternode
        openDialogAction={actions.dialogs.open.trigger}  
        isDialogOpen={uiDialogs.isOpen}
        myMasternodeList = {myMasternodeList}
      />
    );
  }

}
