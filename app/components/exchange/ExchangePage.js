import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ExchangeSettingPage from "./ExchangeSettingPage";
import styles from "./ExchangePage.scss";

type Props = {
    openDialogAction: Function,
    isDialogOpen: Function,
  };

@observer
export default class ExchangePage extends Component<Props> {

    render() {
        const {
            openDialogAction, 
            isDialogOpen,
          } = this.props;

        return (
            <div className={styles.component}>
                <ExchangeSettingPage
                    openDialogAction={openDialogAction}  
                    isDialogOpen={isDialogOpen}
                />
            </div>   
        );
    }
}

