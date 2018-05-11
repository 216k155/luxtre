import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ExchangeSettingPage from "./ExchangeSettingPage";
import styles from "./ExchangePage.scss";
import { CoinInfo } from '../../domain/CoinInfo';

type Props = {
    coinInfoList: Array<CoinInfo>,
    openDialogAction: Function,
    isDialogOpen: Function,
    onChangeCoin: Function
  };

@observer
export default class ExchangePage extends Component<Props> {

    render() {
        const {
            coinInfoList,
            openDialogAction, 
            isDialogOpen,
            onChangeCoin
          } = this.props;

        return (
            <div className={styles.component}>
                <ExchangeSettingPage
                    coinInfoList={coinInfoList}
                    openDialogAction={openDialogAction}  
                    isDialogOpen={isDialogOpen}
                    onChangeCoin={onChangeCoin}
                />
            </div>   
        );
    }
}

