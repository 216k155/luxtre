import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ExchangeSettingPage from "./ExchangeSettingPage";
import styles from "./ExchangePage.scss";
import { CoinInfo, LGOrders } from '../../domain/CoinInfo';
import {LuxgateLog} from '../../types/LuxgateLogType';


type Props = {
    coinPrice: number,
    ordersData: LGOrders,
    coinInfoList: Array<CoinInfo>,
    logbuff: Array<LuxgateLog>,
    openDialogAction: Function,
    isDialogOpen: Function,
    onChangeCoin: Function,
    onSwapCoin: Function
  };

@observer
export default class ExchangePage extends Component<Props> {

    render() {
        const {
            coinPrice,
            ordersData,
            coinInfoList,
            logbuff,
            openDialogAction, 
            isDialogOpen,
            onChangeCoin,
            onSwapCoin
          } = this.props;

        return (
            <div className={styles.component}>
                <ExchangeSettingPage
                    coinPrice={coinPrice}
                    ordersData={ordersData}
                    coinInfoList={coinInfoList}
                    logbuff={logbuff}
                    openDialogAction={openDialogAction}  
                    isDialogOpen={isDialogOpen}
                    onChangeCoin={onChangeCoin}
                    onSwapCoin={onSwapCoin}
                />
            </div>   
        );
    }
}

