// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import ReactToolboxMobxForm from '../../utils/ReactToolboxMobxForm';
import DialogCloseButton from '../widgets/DialogCloseButton';
import Dialog from '../widgets/Dialog';
import QRCode from 'qrcode.react';
import globalMessages from '../../i18n/global-messages';
import LocalizableError from '../../i18n/LocalizableError';
import styles from './ReceiveAddressDialog.scss';
import iconCopy from '../../assets/images/clipboard-ic.inline.svg';
import SvgInline from 'react-svg-inline';
import CopyToClipboard from 'react-copy-to-clipboard';

type Props = {
    coinName: string,
    walletAddress: string,
    onCopyAddress: Function,
    error: ?LocalizableError,
    onCancel: Function,
    children: Node
};

@observer
export default class ReceiveAddressDialog extends Component<Props> {

    static defaultProps = {
        coinName: '',
        walletAddress: '',
        error: null,
        children: null
    };
 
    render() {
        const { intl } = this.context;
        const {
            coinName,
            walletAddress,
            onCopyAddress,
            error,
            onCancel,
            children
        } = this.props;

        const actions = [
            {
                label: 'Close',
                onClick: onCancel
            }
        ];

        return (
            <Dialog
                title={coinName}
                actions={actions}
                closeOnOverlayClick
                onClose={onCancel}
                className={styles.dialog}
                closeButton={<DialogCloseButton onClose={onCancel} />}
              >
                {walletAddress != '' ? (
                    <div className={styles.info}>
                        <QRCode
                            value={walletAddress}
                            size={200}
                            />
                        <div className={styles.address}> {walletAddress}
                            <CopyToClipboard
                                text={walletAddress}
                                onCopy={onCopyAddress.bind(this, walletAddress)}
                                >
                                <SvgInline svg={iconCopy} className={styles.copyIconBig} />
                            </CopyToClipboard>
                        </div>
                    </div>
                    ) : (
                    <div className={styles.info}/>
                )}
                {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}
                {children}
            </Dialog>
        );
    }

}
