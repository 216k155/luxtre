// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/InputSkin';
import Checkbox from 'react-polymorph/lib/components/Checkbox';
import SimpleSwitchSkin from 'react-polymorph/lib/skins/simple/SwitchSkin';
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
  rpcallowip: string,
  rpcuser: string,
  rpcpassword: string,
  staking: number,
  server: number,
  listen: number,
  port: string,
  masternode: number,
  masternodeaddr: string,
  masternodeprivkey: string,
  onCancel: Function,
  error: ?LocalizableError,
};

@observer
export default class InfoMasternodeDialog extends Component<Props> {

  static defaultProps = {
    rpcallowip: '127.0.0.1',
    rpcuser: 'REPLACEME',
    rpcpassword: 'REPLACEME',
    staking: 0,
    server: 1,
    listen: 1,
    port: 'REPLACEMEWITHYOURPORT',
    masternode: 1,
    masternodeaddr: '',
    masternodeprivkey: '',
  };
 
  render() {
    const { intl } = this.context;
    const {
      onCancel,
      rpcallowip,
      rpcuser,
      rpcpassword,
      staking,
      server,
      listen,
      port,
      masternode,
      masternodeaddr,
      masternodeprivkey,
      error,
    } = this.props;

    return (
      <Dialog
        title={"LuxNodes Node Configuration"}
        closeOnOverlayClick
        onClose={onCancel}
        className={styles.dialog}
        closeButton={<DialogCloseButton onClose={onCancel} />}
      >
        <div className={styles.inputFields}>
          <div> rpcallowip = {rpcallowip}</div>
          <div> rpcuser = {rpcuser}</div>
          <div> rpcpassword = {rpcpassword}</div>
          <div> staking = {staking}</div>
          <div> server = {server}</div>
          <div> listen = {listen}</div>
          <div> port = {port}</div>
          <div> masternode = {masternode}</div>
          <div> masternodeaddr = {masternodeaddr}</div>
          <div> masternodeprivkey = {masternodeprivkey}</div>
        </div>
        {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}

      </Dialog>
    );
  }

}
