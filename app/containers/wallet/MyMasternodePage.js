// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { ellipsis } from '../../utils/strings';
import config from '../../config';
import { defineMessages, FormattedHTMLMessage } from 'react-intl';
import NoMasternodes from '../../components/wallet/masternodes/NoMasternodes';
import Masternode from '../../components/wallet/masternodes/Masternode';
import NotificationMessage from '../../components/widgets/NotificationMessage';
import successIcon from '../../assets/images/success-small.inline.svg';
import type { InjectedProps } from '../../types/injectedPropsType';
import VerticalFlexContainer from '../../components/layout/VerticalFlexContainer';

export const messages = defineMessages({
  message: {
    id: 'wallet.receive.page.addressCopyNotificationMessage',
    defaultMessage: '!!!You have successfully copied wallet address',
    description: 'Message for the wallet address copy success notification.',
  },
});

type Props = InjectedProps

type State = {
  copiedAddress: string,
};

@inject('stores', 'actions') @observer
export default class MyMasternodePage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  state = {
    copiedAddress: '',
  };

  componentWillUnmount() {
    this.closeNotification();
  }

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

  closeNotification = () => {
    const { wallets } = this.props.stores.lux;
    const wallet = wallets.active;
    if (wallet) {
      const notificationId = `${wallet.id}-copyNotification`;
      this.props.actions.notifications.closeActiveNotification.trigger({ id: notificationId });
    }
  };

  render() {
    const { copiedAddress } = this.state;
    const { uiDialogs, uiNotifications } = this.props.stores;
    const { intl } = this.context;
    const actions = this.props.actions;
    const { masternodes, wallets} = this.props.stores.lux;
    const { getMasternodeOutputs, myMasternodeList } = masternodes;
    const activeWallet = wallets.active;

    const notification = {
      id: `${activeWallet.id}-copyNotification`,
      duration: config.wallets.ADDRESS_COPY_NOTIFICATION_DURATION,
      message: (
        <FormattedHTMLMessage
          {...messages.message}
          values={{ walletAddress: ellipsis(copiedAddress, 8) }}
        />
      ),
    };

    return (
      <VerticalFlexContainer>
        <Masternode
          getMasternodeOutputs={() => (
            getMasternodeOutputs()
          )}
          masternodeAction={(actionType, values) => (
            this.handleMasternodeAction(actionType, values)
          )}
          onCopyAddress={(address) => {
            this.setState({ copiedAddress: address });
            actions.notifications.open.trigger({
              id: notification.id,
              duration: notification.duration,
            });
          }}
          error={this.getMasternodeError}
          openDialogAction={actions.dialogs.open.trigger}  
          isDialogOpen={uiDialogs.isOpen}
          isWalletPasswordSet={activeWallet.hasPassword}
          myMasternodeList = {myMasternodeList}
        />

        <NotificationMessage
            icon={successIcon}
            show={uiNotifications.isOpen(notification.id)}
        >
          {notification.message}
        </NotificationMessage>
      </VerticalFlexContainer>
    );
  }

}
