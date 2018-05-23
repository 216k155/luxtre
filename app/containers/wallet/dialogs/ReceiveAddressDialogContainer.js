// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ellipsis } from '../../../utils/strings';
import config from '../../../config';
import { defineMessages, FormattedHTMLMessage } from 'react-intl';
import ReceiveAddressDialog from '../../../components/exchange/ReceiveAddressDialog';
import NotificationMessage from '../../../components/widgets/NotificationMessage';
import type { InjectedProps } from '../../../types/injectedPropsType';
import environment from '../../../environment';
import successIcon from '../../../assets/images/success-small.inline.svg';

type Props = {
  stores: any | StoresMap,
  actions: any | ActionsMap,
  coinName: string,
  walletAddress: string,
  error: string
};

type State = {
  copiedAddress: string,
};

export const messages = defineMessages({
  message: {
    id: 'wallet.receive.page.addressCopyNotificationMessage',
    defaultMessage: '!!!You have successfully copied wallet address',
    description: 'Message for the wallet address copy success notification.',
  },
});

@inject('actions', 'stores') @observer
export default class ReceiveAddressDialogContainer extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  state = {
    copiedAddress: '',
  };

  componentWillUnmount() {
    this.closeNotification();
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
    const { actions, coinName, walletAddress, error } = this.props;
    const { uiDialogs, uiNotifications } = this.props.stores;
    const { wallets } = this.props.stores[environment.API];
    const activeWallet = wallets.active;

    if (!activeWallet) throw new Error('Active wallet required for ReceiveAddressDialogContainer.');

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
      <ReceiveAddressDialog
        coinName = {coinName}
        walletAddress = {walletAddress}
        onCopyAddress={(address) => {
          this.setState({ copiedAddress: address });
          actions.notifications.open.trigger({
            id: notification.id,
            duration: notification.duration,
          });
        }}
        error = {error}
        onCancel={() => {
          actions.dialogs.closeActiveDialog.trigger();
        }}
      >
        <NotificationMessage
            icon={successIcon}
            show={uiNotifications.isOpen(notification.id)}
        >
          {notification.message}
        </NotificationMessage>
      </ReceiveAddressDialog>
    );
  }

}
