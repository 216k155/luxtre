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
import styles from './CallSmartContract.scss';
import Select from 'react-polymorph/lib/components/Select';
import SelectSkin from 'react-polymorph/lib/skins/simple/SelectSkin';
import Web3EthAbi from 'web3-eth-abi';

export const messages = defineMessages({
  title: {
    id: 'smartcontract.call.title',
    defaultMessage: '!!!Call Smart Contract',
    description: 'Title "Call Smart Contract" in the Smart Contract.'
  },
  inputContractAddress: {
    id: 'smartcontract.call.input.address',
    defaultMessage: '!!!Contract Address',
    description: 'Label "Contract Address" of the Smart Contract Input.'
  },
  textareaABI: {
    id: 'smartcontract.call.textarea.abi',
    defaultMessage: '!!!Interface (ABI)',
    description: 'Label "Interface (ABI)" of the Smart Contract textarea.'
  },
  areaFunction: {
    id: 'smartcontract.call.area.function',
    defaultMessage: '!!!Function',
    description: 'Label "Function" of the Smart Contract Constructor.'
  },
  areaOptional: {
    id: 'smartcontract.call.area.optional',
    defaultMessage: '!!!Optional',
    description: 'Label "Optional" of the Smart Contract Optional.'
  },
  inputSenderAddress: {
    id: 'smartcontract.call.input.sendaddress',
    defaultMessage: '!!!Sender Address',
    description: 'Label "Sender Address" of input spin in the Call Smart Contract tab.'
  },
});

type Props = {
  createContract: Function,
  error: ?LocalizableError
};

type State = {
  contractAddress: string,
  abi: string,
  arrFunctions: Array<Object>,
  arrInputs : Array<Object>,
  selFunc: string,
  gasLimit: number,
  gasPrice: number,
  senderAddress: string
};

@observer
export default class CallSmartContract extends Component<State> {
  state = {
    contractAddress: '',
    abi: '',
    arrFunctions: [],
    arrInputs:[],
    selFunc: '',
    gasLimit: 2500000,
    gasPrice: 0.0000004,
    senderAddress: ''
  };

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
            if(data.type == "function" && data.constant) {
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

  _callContract() {

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
      this.props.callContract(this.state.contractAddress, data, senderaddress);
    }
  }

  render() {
    const {
      contractAddress, 
      abi, 
      arrFunctions,
      arrInputs,
      selFunc,
      gasLimit,
      gasPrice,
      senderAddress
      } = this.state;
    
    const { intl } = this.context;
    
    const {
      callContract,
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
          <div className={styles.areaFunction}>
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
          <div className={styles.addressContainer}> 
            <div className={styles.optionalLabel}>{intl.formatMessage(messages.inputSenderAddress)} </div>
            <input className={styles.addressInput} value={senderAddress} type="text" onChange={event => this.setState({senderAddress: event.target.value})}/>
          </div>
        </div>

        {error ? <p className={styles.error}>{intl.formatMessage(error)}</p> : null}
        
        <div className={styles.buttonContainer}>
          <Button
            className={buttonClasses}
            onClick={() => {
              this._callContract();
            }}
            label="Call Contract"
            skin={<SimpleButtonSkin/>}
          />
          <Button
            className={buttonClasses}
            label="Clear All"
            skin={<SimpleButtonSkin/>}
          />
        </div>
      </div>
    );
  }
}
