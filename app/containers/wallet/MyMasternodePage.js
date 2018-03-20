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

  handleMasternodeAction = (actionType: string, values: object) => {
    switch (actionType){
      case 'start':
        this.props.actions.lux.masternodes.startMasternode.trigger(values);
        break;
      case 'stop':
        this.props.actions.lux.masternodes.stopMasternode.trigger(values);
        break;
      case 'startMany':
        this.props.actions.lux.masternodes.startManyMasternode.trigger(values);
        break;
      case 'stopMany':
        this.props.actions.lux.masternodes.stopManyMasternode.trigger(values);
        break;
    }
  }

  getMasternodeError = () => {
    const { masternodes } = this.props.stores[environment.API];
    const { 
      startMasternodeRequest,
      stopMasternodeRequest,
      startManyMasternodeRequest,
      stopManyMasternodeRequest,
     } = masternodes;

     return startMasternodeRequest.error || stopMasternodeRequest.error || startManyMasternodeRequest.error || stopManyMasternodeRequest.error;
     
  }

  render() {
    const { uiDialogs } = this.props.stores;
    const { intl } = this.context;
    const actions = this.props.actions;
    const { masternodes, wallets} = this.props.stores.lux;
    const { getMasternodeOutputs, myMasternodeList } = masternodes;
    const activeWallet = wallets.active;
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
        getMasternodeOutputs={() => (
          getMasternodeOutputs()
        )}
        masternodeAction={(actionType, values) => (
          this.handleMasternodeAction(actionType, values)
        )}
        error={this.getMasternodeError}
        openDialogAction={actions.dialogs.open.trigger}  
        isDialogOpen={uiDialogs.isOpen}
        isWalletPasswordSet={activeWallet.hasPassword}
        myMasternodeList = {myMasternodeList}
      />
    );
  }

}
