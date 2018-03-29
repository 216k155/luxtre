// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styles from './PosCalculator.scss';

type State = {
  numberOfCoinsStart: number,
  ageOfTransaction: number,
  posDifficulty: number,
};

@observer
export default class PosCalculator extends Component<State> {
  state = {
    numberOfCoinsStart: 1000,
    ageOfTransaction: 31,
    posDifficulty: 10,
  };

  toFixed = (value:number, precision:number) => {
    precision = (precision || 0);
    var neg = (value < 0);
    var power = Math.pow(10, precision);
    value = Math.round(value * power);
    var integral = String((neg ? Math.ceil : Math.floor)(value / power));
    var fraction = String((neg ? -value : value) % power);
    var padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
    var res = precision ? (integral + '.' +  padding + fraction) : integral;
    return res;
  };

  calculateProbStake = (days:number, coins:number, difficulty:number) => {
    var prob = 0;
    if (days > 30) {
        var maxTarget = Math.pow(2, 224);
        var target = maxTarget / difficulty;
        var dayWeight = Math.min(days, 90) - 30;
        prob = (target * coins * dayWeight) / Math.pow(2, 256);
    }
    return prob;
  };

  calculateProbNextBlock = (days:number, coins:number, difficulty:number) => {
    var prob = this.calculateProbStake(days, coins, difficulty);
    var res = 1 - Math.pow(1 - prob, 60 * 10);
    return res;
  };

  calculateProbBlockToday = (days:number, coins:number, difficulty:number) => {
    var prob = this.calculateProbStake(days, coins, difficulty);
    var res = 1 - Math.pow(1 - prob, 60 * 10 * 6 * 24);
    return res;
  };

  calculateProbBlockNDays = (days:number, coins:number, difficulty:number, n:number) => {
    var prob = 1;
    var p = 0;
    for (let i = 0; i < n; i++) {
        p = this.calculateProbBlockToday(parseFloat(days) + i, coins, difficulty);
        prob = prob * (1 - p);
    }
    prob = 1 - prob;
    return prob;
  };

  calculateReward = (days:number, coins:number) => {
    var res = 0;
    if (days > 30) {
        res = 0.01 * (days * coins * 33) / (365 * 33 + 8);
    }
    return this.toFixed(res, 2);
  };

  walletExportMnemonicValidator = (value :string) => {
    const isValidRecoveryPhrase = value === this.props.walletExportMnemonic;
    this.setState({ isValidRecoveryPhrase });
    return isValidRecoveryPhrase;
  };

  render() {
    const { numberOfCoinsStart, ageOfTransaction, posDifficulty } = this.state;

    return (
      <div className={styles.component}>
        <div className={styles.categoryTitle}> Proof-Of-Stake (POS) Calculator </div>
        <div className={styles.description}>
          <span><label>Currently it is very early days... so only basic functions but you can:</label></span>
          <li className={styles.intentliContent}><label>Enter the amount of coins you sent in a transaction, the number of days that have passed and the POS difficulty to get a readout.</label></li>
          <li className={styles.intentliContent}><label>The probability of minting a block reaches its maximum after 90 days and doesn't increase after that.</label></li>
          <li className={styles.intentliContent}><label>The POS difficulty value can be obtained from the console window of lux-qt. </label></li>
          <li className={styles.intentliContent}><label>More features to come...</label></li>
        </div>

        <div className={styles.row}> 
          <label className={styles.line}> Number Of Coins </label>
          <input value={this.state.numberOfCoinsStart} type="number" min="0" max="1000000000" onChange={event => this.setState({numberOfCoinsStart: event.target.value.replace(/\D/,'')})}/>
        </div>
        <div className={styles.row}> 
          <label className={styles.line}> Age of transaction (days) </label>
          <input value={this.state.ageOfTransaction} type="number" min="0" max="1000000000" onChange={event => this.setState({ageOfTransaction: event.target.value.replace(/\D/,'')})}/>
        </div>
        <div className={styles.row}> 
          <label className={styles.line}> POS difficulty </label>
          <input value={this.state.posDifficulty} type="number" min="0" max="1000000000" onChange={event => this.setState({posDifficulty: event.target.value.replace(/\D/,'')})}/>
        </div>
        <table className={styles.result}>
          <thead>
            <tr>
                <th><label id="prob_mint">Minting POS block within</label></th>
                <th><label id="prob_10m">10 min</label></th>
                <th><label id="prob_24h">24 hours</label></th>
                <th><label id="prob_31d">31 days</label></th>
                <th><label id="prob_90d">90 days</label></th>
                <th><label id="prob_1y">1 year</label></th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <th className={styles.side}><label id="prob_prob">Probability</label></th>
                <td className={styles.num}><label id="probNextBlock">{this.toFixed(this.calculateProbNextBlock(this.state.ageOfTransaction, this.state.numberOfCoinsStart, this.state.posDifficulty) * 100, 6)}%</label></td>
                <td className={styles.num}><label id="probBlockToday">{this.toFixed(this.calculateProbBlockToday(this.state.ageOfTransaction, this.state.numberOfCoinsStart, this.state.posDifficulty) * 100, 6)}%</label></td>
                <td className={styles.num}><label id="probBlock31d">{this.toFixed(this.calculateProbBlockNDays(this.state.ageOfTransaction, this.state.numberOfCoinsStart, this.state.posDifficulty, 31) * 100, 6)}%</label></td>
                <td className={styles.num}><label id="probBlock90d">{this.toFixed(this.calculateProbBlockNDays(this.state.ageOfTransaction, this.state.numberOfCoinsStart, this.state.posDifficulty, 90) * 100, 6)}%</label></td>
                <td className={styles.num}><label id="probBlockYear">{this.toFixed(this.calculateProbBlockNDays(this.state.ageOfTransaction, this.state.numberOfCoinsStart, this.state.posDifficulty, 365) * 100, 6)}%</label></td>
            </tr>
            <tr>
                <th className={styles.side}><label id="reward_block">Reward</label></th>
                <td className={styles.num}><label id="rewardNextBlock">{this.calculateReward(parseFloat(this.state.ageOfTransaction), this.state.numberOfCoinsStart)}LUX</label></td>
                <td className={styles.num}><label id="rewardBlockToday">{this.calculateReward(parseFloat(this.state.ageOfTransaction) + 1, this.state.numberOfCoinsStart)}LUX</label></td>
                <td className={styles.num}><label id="rewardBlock31d">{this.calculateReward(parseFloat(this.state.ageOfTransaction) + 31, this.state.numberOfCoinsStart)}LUX</label></td>
                <td className={styles.num}><label id="rewardBlock90d">{this.calculateReward(parseFloat(this.state.ageOfTransaction) + 90, this.state.numberOfCoinsStart)}LUX</label></td>
                <td className={styles.num}><label id="rewardBlockYear">{this.calculateReward(parseFloat(this.state.ageOfTransaction) + 365, this.state.numberOfCoinsStart)}LUX</label></td>
            </tr>
        </tbody>
        </table>
      </div>
    );
  }
}
