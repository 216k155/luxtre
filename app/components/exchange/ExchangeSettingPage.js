import React, { Component } from 'react';
import type { Node } from 'react';
import { observer } from 'mobx-react';
import Select from 'react-polymorph/lib/components/Select';
import SelectSkin from 'react-polymorph/lib/skins/simple/SelectSkin';
import NumericInput from 'react-polymorph/lib/components/NumericInput';
import InputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import Button from 'react-polymorph/lib/components/Button';
import ButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import SimpleButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import Checkbox from 'react-polymorph/lib/components/Checkbox';
import TogglerSkin from 'react-polymorph/lib/skins/simple/TogglerSkin';
import ReceiveAddressDialog from './ReceiveAddressDialog';
import ReceiveAddressDialogContainer from '../../containers/wallet/dialogs/ReceiveAddressDialogContainer'
import SendCoinDialog from './SendCoinDialog';
import SendCoinDialogContainer from '../../containers/wallet/dialogs/SendCoinDialogContainer'
import styles from "./ExchangeSettingPage.scss"
import { CoinInfo } from '../../domain/CoinInfo';
import COINS from "./coins";
import sendImage from "../../assets/images/wallet-nav/send.png";
import recvImage from "../../assets/images/wallet-nav/receive.png";
import { formattedAmountToBigNumber, formattedAmountToNaturalUnits } from '../../utils/formatters';

import ReactTable from "react-table";
import "react-table/react-table.css";
import ExchangeChartPage from "./ExchangeChartPage";

type Props = {
    coinInfoList: Array<CoinInfo>,
    openDialogAction: Function,
    isDialogOpen: Function,
    onChangeCoin: Function
}

type State = {
    isBuy: boolean,
    AmountInput: string, 
    ValueInput:	string,
    Coin1: string,
    Coin2: string,
    recvCoin: string,
    recvAddress: string
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
        balance: ''
    };

    componentDidMount() {
        this.props.onChangeCoin('BTC');
        this.props.onChangeCoin('LUX');
    }

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
        this.props.onChangeCoin(value);
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

    //{myMasternodeList.map((myMasternode, index) => (
    //    {myMasternode.address}
    //))}

    render() {
        const { isBuy, 
            AmountInput, 
            ValueInput, 
            Coin1, 
            Coin2, 
            recvCoin, 
            sendCoin, 
            recvAddress, 
            balance } = this.state;
            
        const {
            coinInfoList,
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
            <div className={styles.pageContainer}>
                <div>
                    <div className={styles.divStatus}>
                        <span>{Coin1}/{Coin2}</span>
                    </div>
                    <div className={styles.divBalance}>    
                        <div className={styles.margin_left20}>Balance</div>
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
                        <div className={styles.divTotal}>
                            <span className={styles.spanMargin36}> Total: </span>
                            <span> {this.calculateTotal(AmountInput, ValueInput)} {Coin2} </span>
                        </div>
                        <div className={styles.swapbutton}>
                            <Button
                                label="SWAP NOW"
                                skin={<SimpleButtonSkin/>}
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
            </div>   
        );
    }
}

