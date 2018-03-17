// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import moment from 'moment';
import styles from './MasternodeListStyle.scss';
import Masternode from '../../../domain/Masternode';
import LoadingSpinner from '../../widgets/LoadingSpinner';

const dateFormat = 'YYYY-MM-DD h:mm:ss';

type Props = {
  masternodes: Array<Masternode>,
  totalActivated: number
};

@observer
export default class MasternodesList extends Component<Props> {

  formatTime(seconds) {
    var days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    var hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;
    hrs = hrs < 10 ? '0' + hrs : hrs;
    mnts = mnts < 10 ? '0' + mnts : mnts;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var time = days > 0 ? days+"d "+hrs+"h "+mnts+"m "+seconds+"s" : hrs+"h "+mnts+"m "+seconds+"s";
    return time; 
  }

  render() {
    const {masternodes, totalActivated} = this.props;
      
    return (
      <div className={styles.component}>
        <div className={styles.categoryTitle}>
          Lux Masternodes Activated: {totalActivated}
        </div>

        {masternodes.map((masternode, index) => (
          <div key={index} className={styles.list}>
            <div className={styles.Address}> {masternode.address} </div>
            <div className={styles.Rank}> {masternode.rank} </div>
            <div className={styles.Activate}> {masternode.active} </div>
            <div className={styles.ActiveTime}> {this.formatTime(masternode.activeSeconds)} </div>
            <div className={styles.LastSeen}> {moment(masternode.lastSeen * 1000).format(dateFormat)} </div>
            <div className={styles.Pubkey}> {masternode.pubKey} </div>
          </div>
        ))}
      </div>
    );
  }

}
