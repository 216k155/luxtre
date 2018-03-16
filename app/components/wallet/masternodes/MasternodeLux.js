// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import moment from 'moment';
import styles from './MasternodeListStyle.scss';
import WalletTransaction from '../../../domain/WalletTransaction';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import CreateMasternodeDialog from './CreateMasternodeDialog';
import CreateMasternodeDialogContainer from '../../../containers/wallet/dialogs/CreateMasternodeDialogContainer';

type Props = {
  openDialogAction: Function,
  isDialogOpen: Function,
  hasMoreToLoad: boolean,
  onLoadMore: Function,
  assuranceMode: AssuranceMode,
  walletId: string
};

@observer
export default class MasternodeLux extends Component<Props> {

  render() {
    const activates = [
      {
        Alias: 'mm1',
        IP: '168.100.90.123:26868',
        Status: "ok",
        Collateral: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Alias: 'mm2',
        IP: '168.100.90.123:26868',
        Status: "ok",
        Collateral: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
    ];

    const {
      openDialogAction, 
      isDialogOpen,
    } = this.props;


/*
        <div className={styles.tbTitle}>
          <div className={styles.Address}> Address </div>
          <div className={styles.Rank}> Rank </div>
          <div className={styles.Activate}> Activate </div>
          <div className={styles.ActiveTime}> ActiveTime </div>
          <div className={styles.LastSeen}> LastSeen </div>
          <div className={styles.Pubkey}> Pubkey </div>
        </div>
*/
    return (
      <div className={styles.component}>
        <button
            className={styles.button}
            onClick={() => openDialogAction({
              dialog: CreateMasternodeDialog,
            })}
          >
            Create...
        </button>

        {activates.map((activate, index) => (
          <div className={styles.list}>
            <div className={styles.Alias}> {activate.Alias} </div>
            <div className={styles.ip}> {activate.IP} </div>
            <div className={styles.Status}> {activate.Status} </div>
            <div className={styles.Collateral}> {activate.Collateral} </div>
          </div>
        ))}

        {isDialogOpen(CreateMasternodeDialog) ? (
          <CreateMasternodeDialogContainer />
        ) : null}

      </div>
    );
  }

}
