import React, { Component } from 'react';
import type { Node } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Select from 'react-polymorph/lib/components/Select';
import SelectSkin from 'react-polymorph/lib/skins/simple/SelectSkin';
import NumericInput from 'react-polymorph/lib/components/NumericInput';
import InputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import Checkbox from 'react-polymorph/lib/components/Checkbox';
import TogglerSkin from 'react-polymorph/lib/skins/simple/TogglerSkin';
import LuxgateLoginDialog from './LuxgateLoginDialog';
import LuxgateSettingsDialog from './LuxgateSettingsDialog';
import LuxgateLoginDialogContainer from '../../containers/wallet/dialogs/LuxgateLoginDialogContainer'
import LuxgateSettingsDialogContainer from '../../containers/wallet/dialogs/LuxgateSettingsDialogContainer'
import ReceiveAddressDialog from './ReceiveAddressDialog';
import ReceiveAddressDialogContainer from '../../containers/wallet/dialogs/ReceiveAddressDialogContainer'
import SendCoinDialog from './SendCoinDialog';
import SendCoinDialogContainer from '../../containers/wallet/dialogs/SendCoinDialogContainer'
import styles from "./ExchangeSettingPage.scss"
import { CoinInfo, LGOrders } from '../../domain/CoinInfo';
import COINS from "./coins";
import sendImage from "../../assets/images/wallet-nav/send.png";
import recvImage from "../../assets/images/wallet-nav/receive.png";
import switchCoinImage from "../../assets/images/wallet-nav/switch-coin.png";
import { formattedAmountToBigNumber, formattedAmountToNaturalUnits } from '../../utils/formatters';
import {LuxgateLog} from '../../types/LuxgateLogType';

import ReactTable from "react-table";
import "react-table/react-table.css";
import ExchangeChartPage from "./ExchangeChartPage";

type Props = {
    coinPrice: number,
    ordersData: LGOrders,
    coinInfoList: Array<CoinInfo>,
    logbuff: Array<LuxgateLog>,
    openDialogAction: Function,
    isDialogOpen: Function,
    onChangeCoin: Function,
    onSwapCoin: Function
}

type State = {
    isBuy: boolean,
    AmountInput: string, 
    ValueInput:	string,
    Coin1: string,
    Coin2: string,
    recvCoin: string,
    recvAddress: string,
    isShowLog: boolean,
}

@observer
export default class ExchangeSettingPage extends Component<Props, State>{
    
    state = {
        isBuy: true,
        AmountInput: '',
        ValueInput: '',
        Coin1: 'BTC',
        Coin2: 'LUX',
        recvCoin: '',
        sendCoin: '',
        recvAddress: '',
        balance: '',
        isShowLog: true
    };

    componentDidMount() {
        this.props.onChangeCoin('all', 0);
    }

    toggleLogAndHistory() {
        this.setState({ isShowLog: !this.state.isShowLog });
    }

    changeAmountInput(value) {
        this.setState({ AmountInput: value });
    }

    changeValueInput(value) {
        this.setState({ ValueInput: value });
    }

    changeCoin1(value) {
        if(value == this.state.Coin2)
            return;
        this.setState( {Coin1: value});
        this.props.onChangeCoin(value, 1);
    }

    changeCoin2(value) {
        if(value == this.state.Coin1)
            return;
        this.setState( {Coin2: value});
        this.props.onChangeCoin(value, 2);
    }

    swapCoin() {
        if(this.state.AmountInput == 0 || this.state.ValueInput == 0)
            return;

        var buy_coin = this.state.Coin1;
        var sell_coin = this.state.Coin2;
        var amount = this.state.AmountInput;
        var value = this.state.ValueInput;
        this.props.onSwapCoin(buy_coin, sell_coin, parseFloat(amount), parseFloat(value));
    }

    handleSwitchCoin() {
        const coin1 = this.state.Coin1;
        const coin2 = this.state.Coin2;
        this.setState( {Coin1: coin2});
        this.props.onChangeCoin(coin2, 1);
        this.setState( {Coin2: coin1});
        this.props.onChangeCoin(coin1, 2);
    }

    calculateTotal(amount, value) {
        var a = formattedAmountToBigNumber(amount);
        var v = formattedAmountToBigNumber(value);
        if(a == 0 || v == 0) return 0;
        return a * v;
    }

    getCoinBalance(coin) {
        if(this.props.coinInfoList.length != 0)
        {
            let element = this.props.coinInfoList.find((info) => { return info.coin == coin })
            if(element !== undefined)
                return element.balance;
        }
    }

    getCoinAddress(coin) {
        if(this.props.coinInfoList.length != 0)
        {
            let element = this.props.coinInfoList.find((info) => { return info.coin == coin })
            if(element !== undefined)
                return element.address;
        }
    }

    openReceiveDialog(coin) {
        let address = this.getCoinAddress(coin);

        this.setState( {recvCoin: coin});
        this.setState( {recvAddress: address});
        
        this.props.openDialogAction({dialog: ReceiveAddressDialog});
    }

    openSendDialog(coin) {
        
        this.setState( {
            sendCoin: coin,
            balance: this.getCoinBalance(coin)
        });
        
        this.props.openDialogAction({dialog: SendCoinDialog});
    }

    render() {
        const { isBuy, 
            AmountInput, 
            ValueInput, 
            Coin1, 
            Coin2, 
            recvCoin, 
            sendCoin, 
            recvAddress, 
            balance,
            isShowLog } = this.state;
            
        const {
            coinPrice,
            ordersData,
            coinInfoList,
            logbuff,
            openDialogAction, 
            isDialogOpen,
            onChangeCoin
          } = this.props;

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
    
        const orderColumns = [{
            Header: 'Value',
            accessor: 'price' // String-based value accessors!
          }, {
            Header: 'Amount',
            accessor: 'volumn',
          }, {
            id: 'Total', // Required because our accessor is not a string
            Header: 'Total',
            accessor: 'total' // Custom value accessors!
          }]

        const historyColumns = [{
            Header: 'Value',
            accessor: 'value' // String-based value accessors!
          }, {
            Header: 'Amount',
            accessor: 'amount',
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
			width : 30 ,
            height : 30,
            position:'absolute', 
            marginTop: 5,
			marginLeft: 38,
			verticalAlign: 'middle',
        };

        const swapButtonClasses = classnames([
            'primary'
          ]);

        let inputProps = {
            skin: <InputSkin/>,
            className: styles.numericInput,
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
            <div className={styles.pageContainer}>
                <div>
                    <div className={styles.divStatus}>
                        <span>{Coin1}/{Coin2}:</span>
                        <span className={styles.spanPrice}>{coinPrice}</span>
                    </div>
                    <div className={styles.divBalance}>    
                        <div className={styles.coinbalance}>
                            <div className={styles.coin}>{Coin1}</div>
                            <div className={styles.balance}>{this.getCoinBalance(Coin1)}</div>
                            <div className={styles.recv}>
                                <Button
                                    onClick={ () => this.openReceiveDialog(Coin1) }
                                    label="Receive"
                                    skin={<ButtonSkin/>}
                                />    
                            </div>
                            <div className={styles.send}>
                                <Button
                                    onClick={ () => this.openSendDialog(Coin1) }
                                    label="Send"
                                    skin={<ButtonSkin/>}
                                /> 
                            </div>
                        </div>
                        <div className={styles.coinbalance}>
                            <div className={styles.coin}>{Coin2} </div>
                            <div className={styles.balance}>{this.getCoinBalance(Coin2)}</div>
                            <div className={styles.recv}>
                                <Button
                                    onClick={ () => this.openReceiveDialog(Coin2) }
                                    label="Receive"
                                    skin={<ButtonSkin/>}
                                />    
                            </div>
                            <div className={styles.send}>
                                <Button
                                    onClick={ () => this.openSendDialog(Coin2) }
                                    label="Send"
                                    skin={<ButtonSkin/>}
                                /> 
                            </div>
                        </div>
                    </div>  
                </div>    
                <div>
                    <div className={styles.graph}>
                        <ExchangeChartPage/>
                    </div>
                    <div className={styles.setting}>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>Coupled Asset Swap</div>
                            <h6 className={styles.cardSubtitle}>Please swap your currency from here</h6>
                        </div>
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
                            {/*<div className={styles.span}> Amount </div>*/}
                            <NumericInput 
                                {...inputProps}
                                placeholder={'0.000000 '+ Coin1} 
                                value={AmountInput}
                                onChange={this.changeAmountInput.bind(this)}
                            />
                        </div>
                        <div className={styles.switch} >
                            <img src={switchCoinImage} className={styles.switchButton} onClick={this.handleSwitchCoin.bind(this)} />
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
                            {/*<span className={styles.span}> Value </span>*/}
                            <NumericInput 
                                {...inputProps}
                                placeholder={'0.000000 '+ Coin2 + '/' + Coin1} 
                                value={ValueInput}
                                onChange={this.changeValueInput.bind(this)}
                            />
                        </div>
                        <div className={styles.divTotal}>
                            <span className={styles.spanMargin36}> Total: </span>
                            <span> {this.calculateTotal(AmountInput, ValueInput)} {Coin2} </span>
                        </div>
                        <div className={styles.swapbutton}>
                            <Button
                                className={swapButtonClasses}
                                label="Swap Now"
                                onClick={this.swapCoin.bind(this)}
                                skin={<ButtonSkin/>}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.orderTable1}>
                        <div className={styles.orderTableCaptionBar}>
             				<span className={styles.order}> Orders </span>
			            	<div className={styles.tableCaptionPos}>{Coin2} &rArr; {Coin1} </div>
                        </div>
                        <ReactTable
                            data={ordersData.bids}
                            columns={orderColumns}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </div>
                    <div className={styles.orderTable2}>
                        <div className={styles.orderTableCaptionBar}> 
                            <span className={styles.order}> Orders </span>
			            	<div className={styles.tableCaptionPos}> {Coin1} &rArr; {Coin2} </div>
                        </div>
                        <ReactTable
                            data={ordersData.asks}
                            columns={orderColumns}
                            defaultPageSize={10}
                            className="-striped -highlight"
                        />
                    </div>
                    <div className={styles.historyTable}>
                        <div className={styles.LogListCaptionBar}>
                            <Checkbox
                                className={styles.checkboxTab}
                                labelLeft="Log"
                                labelRight="History"
                                onChange={this.toggleLogAndHistory.bind(this)}
                                checked={isShowLog}
                                skin={<TogglerSkin/>}
                            />
                        </div>    
                        { isShowLog ? (
                            <div className={styles.logContainer}>
                            {
                                logbuff.map((data, index) => {
                                    const contentStyle = classnames([
                                        styles.logContent,
                                        data.alarm? styles.red : null
                                    ]); 
                                    return (
                                        <div key={`log-${index}`} className={styles.logStyle}>
                                            <div className={styles.logTime}> [{data.time}] </div>
                                            <div className={contentStyle}>{data.content}</div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        ) : (
                            <ReactTable
                                data={data}
                                columns={historyColumns}
                                defaultPageSize={10}
                                className="-striped -highlight"
                            />
                        )}
                    </div>
                </div>  
                {isDialogOpen(ReceiveAddressDialog) ? (
                    <ReceiveAddressDialogContainer 
                        coinName = {recvCoin}
                        walletAddress = {recvAddress}
                        error = {this.state.outputsError}
                    />
                ) : null} 
                {isDialogOpen(SendCoinDialog) ? (
                    <SendCoinDialogContainer 
                        coinName = {sendCoin}
                        balance = {balance}
                        error = {this.state.outputsError}
                    />
                ) : null} 
                {isDialogOpen(LuxgateLoginDialog) ? (
                    <LuxgateLoginDialogContainer 
                        error = {this.state.outputsError}
                    />
                ) : null}
                {isDialogOpen(LuxgateSettingsDialog) ? (
                    <LuxgateSettingsDialogContainer 
                        error = {this.state.outputsError}
                    />
                ) : null}
            </div>   
        );
    }
}

