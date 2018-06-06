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
import styles from './CallSmartContract.scss';

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

type State = {
  contractAddress: string,
  abi: string,
  gasLimit: number,
  gasPrice: number,
  senderAddress: string
};

@observer
export default class CallSmartContract extends Component<State> {
  state = {
    contractAddress: '',
    abi: '',
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
          <div className={styles.addressContainer}> 
            <div className={styles.optionalLabel}>{intl.formatMessage(messages.inputSenderAddress)} </div>
            <input className={styles.addressInput} value={senderAddress} type="text" onChange={event => this.setState({senderAddress: event.target.value})}/>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            className={buttonClasses}
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
