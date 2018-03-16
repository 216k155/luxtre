// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import moment from 'moment';
import styles from './MasternodeActivates.scss';
import WalletTransaction from '../../../domain/WalletTransaction';
import LoadingSpinner from '../../widgets/LoadingSpinner';

const dateFormat = 'YYYY-MM-DD';

type Props = {
  transactions: Array<WalletTransaction>,
  isLoadingTransactions: boolean,
  hasMoreToLoad: boolean,
  onLoadMore: Function,
  assuranceMode: AssuranceMode,
  walletId: string
};

@observer
export default class MasternodeActivates extends Component<Props> {

  render() {
    const activates = [
      {
        Address: '168.100.90.123:26868',
        Rank: 12,
        Activate: 1,
        ActiveTime: '1d 06h:32m:59',
        LastSeen: '2018-03-16',
        Pubkey: 'LSTJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
      {
        Address: '127.0.0.2:26868',
        Rank: 11,
        Activate: 3,
        ActiveTime: '01h:32m:59',
        LastSeen: '2017-03-16',
        Pubkey: 'LqqJaEkUS5BHtqZbnYdhQe5gqL1FwG74vQ',
      },
    ];
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
        <div className={styles.categoryTitle}>
          lux Masternode Activated: {activates.length}
        </div>

        {activates.map((activate, index) => (
          <div className={styles.list}>
            <div className={styles.Address}> {activate.Address} </div>
            <div className={styles.Rank}> {activate.Rank} </div>
            <div className={styles.Activate}> {activate.Activate} </div>
            <div className={styles.ActiveTime}> {activate.ActiveTime} </div>
            <div className={styles.LastSeen}> {activate.LastSeen} </div>
            <div className={styles.Pubkey}> {activate.Pubkey} </div>
          </div>
        ))}
      </div>
    );
  }

}
