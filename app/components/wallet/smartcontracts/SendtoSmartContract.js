// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { defineMessages, intlShape, FormattedHTMLMessage } from 'react-intl';
import Button from 'react-polymorph/lib/components/Button';
import SimpleButtonSkin from 'react-polymorph/lib/skins/simple/raw/ButtonSkin';
import TextArea from 'react-polymorph/lib/components/TextArea';
import TextAreaSkin from 'react-polymorph/lib/skins/simple/TextAreaSkin';
import Input from 'react-polymorph/lib/components/Input';
import SimpleInputSkin from 'react-polymorph/lib/skins/simple/raw/InputSkin';
import styles from './SendtoSmartContract.scss';

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

type State = {
  contractAddress: string,
  abi: string,
  amount: number,
  gasLimit: number,
  gasPrice: number,
  senderAddress: string
};

@observer
export default class SendtoSmartContract extends Component<State> {
  state = {
    contractAddress: '',
    abi: '',
    amount: 0,
    gasLimit: 2500000,
    gasPrice: 0.0000004,
    senderAddress: ''
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  onChangeContractAddress(value) {
    if(value != this.state.Coin2)
      this.setState( {contractAddress: value});
  }

  onChangeABI(value) {
    if(value != this.state.Coin2)
      this.setState( {abi: value});
  }

  render() {
    const {
      contractAddress, 
      abi, 
      amount,
      gasLimit,
      gasPrice,
      senderAddress
      } = this.state;
    
    const { intl } = this.context;
    
    const buttonClasses = classnames([
      'primary',
      //styles.button
    ]);

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
          <div className={styles.areaFunction} ></div>
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
            label="Send To Contract"
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
