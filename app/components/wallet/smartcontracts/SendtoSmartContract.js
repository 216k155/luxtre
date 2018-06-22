// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import LocalizableError from '../../../i18n/LocalizableError';
import { defineMessages, intlShape, FormattedHTMLMessage } from 'react-intl';
import Button from 'react-polymorph/lib/components/Button';
import SimpleButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import TextArea from 'react-polymorph/lib/components/TextArea';
import TextAreaSkin from 'react-polymorph/lib/skins/simple/TextAreaSkin';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import styles from './SendtoSmartContract.scss';
import Select from 'react-polymorph/lib/components/Select';
import SelectSkin from 'react-polymorph/lib/skins/simple/SelectSkin';
import SendToContractDialog from './SendToContractDialog';
import SendToContractDialogContainer from '../../../containers/wallet/dialogs/SendToContractDialogContainer';
import Web3EthAbi from 'web3-eth-abi';

export const messages = defineMessages({
  title: {
    id: 'smartcontract.sendto.title',
    defaultMessage: '!!!Send to Smart Contract',
    description: 'Title "Send to Smart Contract" in the Smart Contract.'
  },
  inputContractAddress: {
    id: 'smartcontract.sendto.input.address',
    defaultMessage: '!!!Contract Address',
    description: 'Label "Contract Address" of the Smart Contract textarea.'
  },
  textareaABI: {
    id: 'smartcontract.sendto.textarea.abi',
    defaultMessage: '!!!Interface (ABI)',
    description: 'Label "Interface (ABI)" of the Smart Contract textarea.'
  },
  areaFunction: {
    id: 'smartcontract.sendto.area.function',
    defaultMessage: '!!!Function',
    description: 'Label "Function" of the Smart Contract Function.'
  },
  areaOptional: {
    id: 'smartcontract.sendto.area.optional',
    defaultMessage: '!!!Optional',
    description: 'Label "Optional" of the Smart Contract Optional.'
  },
  inputAmount: {
    id: 'smartcontract.sendto.input.amount',
    defaultMessage: '!!!Amount',
    description: 'Label "Amount" of input spin in the Send to Smart Contract tab.'
  },
  inputGasLimit: {
    id: 'smartcontract.sendto.input.gaslimit',
    defaultMessage: '!!!Gas Limit',
    description: 'Label "Gas Limit" of input spin in the Send to Smart Contract tab.'
  },
  inputGasPrice: {
    id: 'smartcontract.sendto.input.gasprice',
    defaultMessage: '!!!Gas Price',
    description: 'Label "Gas Price" of input spin in the Send to Smart Contract tab.'
  },
  inputSenderAddress: {
    id: 'smartcontract.sendto.input.sendaddress',
    defaultMessage: '!!!Sender Address',
    description: 'Label "Sender Address" of input spin in the Send to Smart Contract tab.'
  },
});

type Props = {
  sendToContract: Function,
  openDialogAction: Function,
  isDialogOpen: Function,
  contractaddress: string,
  abi: string,
  gaslimit: number,
  gasprice: number,
  amount: number,
  senderaddress: string,
  isDialogOpen: Function,
  error: ?LocalizableError
};

type State = {
  contractAddress: string,
  abi: string,
  arrFunctions: Array<Object>,
  arrInputs : Array<Object>,
  selFunc: string,
  amount: number,
  gasLimit: number,
  gasPrice: number,
  senderAddress: string
};

@observer
export default class SendtoSmartContract extends Component<Props, State> {
  state = {
    contractAddress: this.props.contractaddress,
    abi: this.props.abi,
    arrInputs:[],
    amount: this.props.amount,
    gasLimit: this.props.gaslimit,
    gasPrice: this.props.gasprice,
    senderAddress: this.props.senderaddress,
    arrFunctions: [],
    arrInputs:[],
    selFunc: ''
  };

  _isMounted = false;
  
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.saveContract(this.state.contractAddress, this.state.abi, this.state.amount, this.state.gasLimit, this.state.gasPrice, this.state.senderAddress);
  }

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  onChangeContractAddress(value) {
    if(value != this.state.contractAddress)
      this.setState( {contractAddress: value});
  }

  onChangeABI(value) {
    if(value != this.state.abi) {
      this.setState( {abi: value});
      if(value == "") {
        this.setState( {arrFunctions: []} );
      } else {
        try {
          let arrFuncs = [];
          let arrABI = JSON.parse(value);
          arrABI.map((data, index) => {
            if(data.type == "function" && !data.constant) {
              data.value = Web3EthAbi.encodeFunctionSignature(data);
              data.label = data.name + '(' + Web3EthAbi.encodeFunctionSignature(data) + ')';
              arrFuncs.push(data);
            }
          })
          this.setState( {arrFunctions: arrFuncs} );
        } catch (error) {
        }
      }
    }
  }

  onChangeFunction(value, event) {
    this.setState({selFunc: value});
    let element = this.state.arrFunctions.find((data) => { return data.value == value })
    if(element !== undefined) {
      this.setState( {arrInputs: element.inputs});
    }
  }

  onClickClearAll() {
    this.setState({
      contractAddress: '',
      abi: '',
      arrInputs:[],
      amount: 0,
      gasLimit: 2500000,
      gasPrice: 0.0000004,
      senderAddress: ''
    })
  }

  async _sendToContract() {
    try {
      let data = this.state.selFunc;
      for(var i = 0; i < this.state.arrInputs.length; i++)
      {
        var parameter = this.refs['function_parameter' + i].value;
        if(parameter == null || parameter == '')
          return;

        var encoded = Web3EthAbi.encodeParameter(this.state.arrInputs[i].type, parameter);
        data += encoded;
      }
      let contractaddress = this.state.contractAddress;
      if(contractaddress !== '')
      {
        let senderaddress = this.state.senderAddress !== '' ? this.state.senderAddress : null;
        let gasLimit = this.state.gasLimit !== '' ? this.state.gasLimit : 2500000;
        let gasPrice = this.state.gasPrice !== '' ? this.state.gasPrice : 0.0000004;
        let amount = this.state.amount !== '' ? this.state.amount : 0;
        const outputs = await this.props.sendToContract(this.state.contractAddress, data, amount, gasLimit, gasPrice, senderaddress);
        if (this._isMounted) {
          this.setState({
            outputs: outputs,
            outputsError: null,
          });
        }
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          outputsError: this.context.intl.formatMessage(error)
        });
      }
    }
  }

  render() {
    const {
      contractAddress, 
      abi, 
      arrFunctions,
      arrInputs,
      selFunc,
      amount,
      gasLimit,
      gasPrice,
      senderAddress
      } = this.state;
    
    const { intl } = this.context;
    
    const {
      openDialogAction, 
      isDialogOpen,
      sendToContract,
      error
    } = this.props;

    const buttonClasses = classnames([
      'primary',
      //styles.button
    ]);
    
    let showSelectControl = !this.state.arrFunctions.length ? null : (
      <Select
        skin= {<SelectSkin/>} 
        className={styles.selectFuncs}
        options={this.state.arrFunctions} 
        value={this.state.selFunc}
        onChange={this.onChangeFunction.bind(this)}
      />
    );

    return (
      <div className={styles.component}>
        <div className={styles.subTitle}> {intl.formatMessage(messages.title)} </div>
        <div className={styles.borderedBox}>
          <div className={styles.contractAddress}>{intl.formatMessage(messages.inputContractAddress)}</div>
          <Input
            skin={<SimpleInputSkin />}
            placeholder="Please Input Contract Address"
            value={contractAddress}
            onChange={this.onChangeContractAddress.bind(this)}
          />
          <div className={styles.abi}>{intl.formatMessage(messages.textareaABI)}</div>
          <TextArea
            skin={<TextAreaSkin />}
            placeholder="Please Input Interface"
            rows={3}
            value={abi}
            onChange={this.onChangeABI.bind(this)}
          />
        </div>
        
        <div className={styles.borderedBox}>
          <div className={styles.contractAddress}>{intl.formatMessage(messages.areaFunction)}</div>
          <div className={styles.areaFunction} >
	          <div className={styles.comboField}> { showSelectControl } </div>
            <div className={styles.inputField}>
            {
              arrInputs.map((data, index) => {
                return (
                  <div key={`con-${index}`} className={styles.tokenElement}>
                    <div className={styles.solVariable}>
                      <span className={styles.solTypeColor}>{data.type}</span>
                      <span className={styles.solVariableLabel}>{data.name}</span>
                    </div>
                    <input  ref={'function_parameter'+index} className={styles.tokenInputBox} type="text"/>
                  </div>
                )
              })
            }
	          </div>
          </div>
        </div>
        <div className={styles.borderedBox}>
          <div className={styles.areaLabel}>{intl.formatMessage(messages.areaOptional)}</div>
          <div className={styles.ammountContainer}> 
            <div className={styles.optionalLabel}>{intl.formatMessage(messages.inputAmount)} </div>
            <input className={styles.addressInput} value={amount} type="text" onChange={event => this.setState({amount: event.target.value})}/>
          </div>
          <div className={styles.optionalContainer}> 
            <div className={styles.gasLimit}>
              <div className={styles.optionalLabel}> {intl.formatMessage(messages.inputGasLimit)} </div>
              <input value={gasLimit} type="number" min="1000000" max="1000000000" onChange={event => this.setState({gasLimit: event.target.value.replace(/\D/,'')})}/>
            </div>
            <div className={styles.gasPrice}> 
              <div className={styles.optionalLabel}> {intl.formatMessage(messages.inputGasPrice)} </div>
              <input value={gasPrice} type="number" min="0.00000001" max="0.00001" step="0.00000001" onChange={event => this.setState({gasPrice: event.target.value})}/> LUX
            </div>
          </div>
          <div className={styles.addressContainer}> 
            <div className={styles.optionalLabel}>{intl.formatMessage(messages.inputSenderAddress)} </div>
            <input className={styles.addressInput} value={senderAddress} type="text" onChange={event => this.setState({senderAddress: event.target.value})}/>
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <Button
            className={buttonClasses}
            onClick={() => {
              this._sendToContract();
              openDialogAction({dialog: SendToContractDialog});
            }}
            label="Send To Contract"
            skin={<SimpleButtonSkin/>}
          />
          <Button
            className={buttonClasses}
            label="Clear All"
            onClick={this.onClickClearAll.bind(this)}
            skin={<SimpleButtonSkin/>}
          />
        </div>
        {isDialogOpen(SendToContractDialog) ? (
          <SendToContractDialogContainer 
            outputs = {this.state.outputs}
            error = {error}
          />
        ) : null}
      </div>
    );
  }
}
