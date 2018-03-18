// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../../widgets/DialogCloseButton';
import Dialog from '../../widgets/Dialog';
import { isValidWalletPassword, isValidRepeatPassword } from '../../../utils/validations';
import globalMessages from '../../../i18n/global-messages';
import LocalizableError from '../../../i18n/LocalizableError';
import styles from './MasternodeDialog.scss';

const messages = defineMessages({
  infoMasternodeTitle: {
    id: 'wallet.masternode.info.dialog.title',
    defaultMessage: '!!!LuxNodes Node Configuration Template',
    description: 'Title for the "luxnodes node Configurateion" dialog.',
  },
});

type Props = {
  masternodeaddr: string,
  masternodeprivkey: string,
  onCancel: Function,
  error: ?LocalizableError,
};

@observer
export default class InfoMasternodeDialog extends Component<Props> {

  static defaultProps = {
    masternodeaddr: '',
    masternodeprivkey: '',
  };
 
  render() {
    const { intl } = this.context;
    const {
      onCancel,
      masternodeaddr,
      masternodeprivkey,
      error,
    } = this.props;

    const actions = [
      {
        label: 'Close',
        onClick: onCancel
      }
    ];

    return (
      <Dialog
        title={"LuxNode Configuration Template"}
        actions={actions}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
        <div className={styles.inputFields}>
          <div> rpcallowip=127.0.0.1</div>
          <div> rpcuser=REPLACEME</div>
          <div> rpcpassword=REPLACEME</div>
          <div> staking=0</div>
          <div> server=1</div>
          <div> listen=1</div>
          <div> port=REPLACEMEWITHYOURPORT</div>
          <div> masternode=1</div>
          <div> masternodeaddr={masternodeaddr}</div>
          <div> masternodeprivkey={masternodeprivkey}</div>
        </div>
        {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}

      </Dialog>
    );
  }

}
