import React, { Component } from 'react';
import type { Node } from 'react';
import { observer } from 'mobx-react';
import Select from 'react-polymorph/lib/components/Select';
import SelectSkin from 'react-polymorph/lib/skins/simple/SelectSkin';
import NumericInput from 'react-polymorph/lib/components/NumericInput';
import InputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import Checkbox from 'react-polymorph/lib/components/Checkbox';
import TogglerSkin from 'react-polymorph/lib/skins/simple/TogglerSkin';
import styles from "./ExchangeSettingPage.scss"
import COINS from "./coins";
import sendImage from "../../assets/images/wallet-nav/send.png";
import recvImage from "../../assets/images/wallet-nav/receive.png";
import { formattedAmountToBigNumber, formattedAmountToNaturalUnits } from '../../utils/formatters';

import ReactTable from "react-table";
import "react-table/react-table.css";
import ExchangeChartPage from "./ExchangeChartPage";

type Props = {
    price_btc: number,
    price_etc: number,
    price_lux: number
}

type State = {
    isBuy: boolean,
    AmountInput: string, 
    ValueInput:	string,
    Coin1: string,
    Coin2: string,
}

@observer
export default class ExchangeSettingPage extends Component<Props, State>{
    
    state = {
        isBuy: true,
        AmountInput: '',
        ValueInput: '',
        Coin1: 'BTC',
        Coin2: 'LUX'
    };

    static defaultProps = {
        price_btc: 9000,
        price_etc: 650,
        price_lux: 15
    };


    toggleBuySell() {
        this.setState({ isBuy: !this.state.isBuy });
    }

    chnageAmountInput(value) {
        this.setState({ AmountInput: value });
    }

    chnageValueInput(value) {
        this.setState({ ValueInput: value });
    }

    changeCoin1(value) {
        this.setState( {Coin1: value});
    }

    changeCoin2(value) {
        this.setState( {Coin2: value});
    }

    calculateTotal(amount, value) {
        var a = formattedAmountToBigNumber(amount);
        var v = formattedAmountToBigNumber(value);
        if(a == 0 || v == 0) return 0;
        return a * v;
    }

    render() {
        const { isBuy, AmountInput, ValueInput, Coin1, Coin2 } = this.state;

        const data = [{
            amount: 19.01711430,
            value: 0.0011686,
            total: 0.01222473,
          },{
            amount: 18.01711430,
            value: 0.00116801,
            total: 0.05222473,
          },{
            amount: 17.01711430,
            value: 0.00115555,
            total: 0.06222473,
          }]
    
        const columns = [{
            Header: 'Value',
            accessor: 'value' // String-based value accessors!
          }, {
            Header: 'Amount',
            accessor: 'amount',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          }, {
            id: 'Total', // Required because our accessor is not a string
            Header: 'Total',
            accessor: 'total' // Custom value accessors!
          }]

        let coinStyle = {
			width : 20 ,
			height : 20,
			borderRadius: 3,
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle',
        };

        let coinImageStyle = {
			width : 26 ,
            height : 26,
            position:'absolute', 
            marginTop: 4,
			marginLeft: 36,
			verticalAlign: 'middle',
        };

        let inputProps = {
            skin: <InputSkin/>,
            className: styles.numericInput,
            placeholder: "0.000000",
            maxBeforeDot: 5,
            maxAfterDot: 6,
            maxValue: 100000,
            minValue: 0.000001              
        };

        let selectProps = {
            skin: <SelectSkin/>,
            className: styles.selectWidth,
            options: COINS,
            optionRenderer: (option) => {
              return (
                <div>
                  <img src={option.image} style={coinStyle}/>
                  <span>{option.label}</span>
                </div>
              );
            }
        }

        return (
            <div>
                <div>
                    <div className={styles.graph}>
                        <ExchangeChartPage/>
                    </div>
                    <div className={styles.setting}>
                        <div className={styles.div}>
                            <span>Balance</span>
                            <span className={styles.spanRight}>{Coin1}/{Coin2}</span>
                        </div>    
                        <div className={styles.div}>
                            <Checkbox
                                className={styles.checkboxTab}
                                labelLeft="BUY"
                                labelRight="SELL"
                                onChange={this.toggleBuySell.bind(this)}
                                checked={isBuy}
                                skin={<TogglerSkin/>}
                            />
                            <div className={styles.component}>
                                { !isBuy ? (
                                    <img src={sendImage} className={styles.imageStyle}/>
                                ) : (
                                    <img src={recvImage} className={styles.imageStyle}/>
                                )
                                }
                                <Select
                                    {...selectProps}
                                    value={Coin1}
                                    onChange={this.changeCoin1.bind(this)}
                                />
                                { Coin1 === '' ? null : (<img src={require('../../assets/crypto/' + Coin1 + '.png')} style={coinImageStyle}/>)}
                                <div className={styles.span}> Amount </div>
                                <NumericInput 
                                    {...inputProps}
                                    value={AmountInput}
                                    onChange={this.chnageAmountInput.bind(this)}
                                />
                            </div>
                            <div className={styles.component}>
                                { !isBuy ? (
                                    <img src={recvImage} className={styles.imageStyle}/>
                                ) : (
                                    <img src={sendImage} className={styles.imageStyle}/>
                                )
                                }
                                <Select
                                    {...selectProps}
                                    value={Coin2}
                                    onChange={this.changeCoin2.bind(this)}
                                />
                                { Coin2 === '' ? null : (<img src={require('../../assets/crypto/' + Coin2 + '.png')} style={coinImageStyle}/>)}
                                <span className={styles.span}> Value </span>
                                <NumericInput 
                                    {...inputProps}
                                    value={ValueInput}
                                    onChange={this.chnageValueInput.bind(this)}
                                />
                            </div>
                            <div className={styles.component}>
                                <span className={styles.spanMargin30}> Total: </span>
                                <span> {this.calculateTotal(AmountInput, ValueInput)} {Coin2} </span>
                            </div>
                        </div>
                        <div className={styles.swapbutton}>
                            <Button
                                label="SWAP NOW"
                                skin={<ButtonSkin/>}
                            />
                        </div>

                    </div>
                </div>
                <div className={styles.margetTable}>
                    <div className={styles.orderTable}>
                        <div className={styles.tableCaption}> SELLERS </div>
                        <ReactTable
                            data={data}
                            columns={columns}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </div>
                    <div className={styles.orderTable}>
                        <div className={styles.tableCaption}> BUYERS </div>
                        <ReactTable
                            data={data}
                            columns={columns}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </div>
                    <div className={styles.historyTable}>
                        <div className={styles.tableCaption}> HISTORY </div>
                        <ReactTable
                            data={data}
                            columns={columns}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </div>
                </div>   
            </div>   
        );
    }
}

