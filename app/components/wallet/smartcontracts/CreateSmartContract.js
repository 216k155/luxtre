// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styles from './CreateSmartContract.scss';

type State = {
  numberOfCoinsStart: number,
  ageOfTransaction: number,
  posDifficulty: number,
};

@observer
export default class CreateSmartContract extends Component<State> {
  state = {
    numberOfCoinsStart: 1000,
    ageOfTransaction: 31,
    posDifficulty: 10,
  };

  walletExportMnemonicValidator = (value :string) => {
    const isValidRecoveryPhrase = value === this.props.walletExportMnemonic;
    this.setState({ isValidRecoveryPhrase });
    return isValidRecoveryPhrase;
  };

  render() {
    return (
      <div className={styles.component}>
        
      </div>
    );
  }
}
