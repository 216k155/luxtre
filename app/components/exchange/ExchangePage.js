import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ExchangeOrderPage from "./ExchangeOrderPage";
import ExchangeSettingPage from "./ExchangeSettingPage";
import styles from "./ExchangePage.scss";

@observer
export default class ExchangePage extends Component{

    render() {
        return (
            <div className={styles.component}>
                <ExchangeSettingPage/>
            </div>   
        );
    }
}

