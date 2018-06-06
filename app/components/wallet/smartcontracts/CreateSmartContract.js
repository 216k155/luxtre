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
import styles from './CreateSmartContract.scss';

export const messages = defineMessages({
  title: {
    id: 'smartcontract.create.title',
    defaultMessage: '!!!Create Smart Contract',
    description: 'Title "Create Smart Contract" in the Smart Contract.'
  },
  textareaBytecode: {
    id: 'smartcontract.create.textarea.bytecode',
    defaultMessage: '!!!Bytecode',
    description: 'Label "Bytecode" of the Smart Contract textarea.'
  },
  textareaABI: {
    id: 'smartcontract.create.textarea.abi',
    defaultMessage: '!!!Interface (ABI)',
    description: 'Label "Interface (ABI)" of the Smart Contract textarea.'
  },
  areaConstructor: {
    id: 'smartcontract.create.area.constructor',
    defaultMessage: '!!!Constructor',
    description: 'Label "Constructor" of the Smart Contract Constructor.'
  },
  areaOptional: {
    id: 'smartcontract.create.area.optional',
    defaultMessage: '!!!Optional',
    description: 'Label "Optional" of the Smart Contract Optional.'
  },
  inputGasLimit: {
    id: 'smartcontract.create.input.gaslimit',
    defaultMessage: '!!!Gas Limit',
    description: 'Label "Gas Limit" of input spin in the create Smart Contract tab.'
  },
  inputGasPrice: {
    id: 'smartcontract.create.input.gasprice',
    defaultMessage: '!!!Gas Price',
    description: 'Label "Gas Price" of input spin in the create Smart Contract tab.'
  },
  inputSenderAddress: {
    id: 'smartcontract.create.input.sendaddress',
    defaultMessage: '!!!Sender Address',
    description: 'Label "Sender Address" of input spin in the create Smart Contract tab.'
  },
});

type State = {
  bytecode: string,
  abi: string,
  gasLimit: number,
  gasPrice: number,
  senderAddress: string
};

@observer
export default class CreateSmartContract extends Component<State> {
  state = {
    bytecode: '',
    abi: '',
    gasLimit: 2500000,
    gasPrice: 0.0000004,
    senderAddress: ''
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  onChangeBytecode(value) {
    if(value != this.state.Coin2)
      this.setState( {bytecode: value});
  }

  onChangeABI(value) {
    if(value != this.state.Coin2)
      this.setState( {abi: value});
  }

  render() {
    const {
      bytecode, 
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
          <div className={styles.bytecode}>{intl.formatMessage(messages.textareaBytecode)}</div>
          <TextArea
            skin={<TextAreaSkin />}
            placeholder="Please Input Bytecode"
            rows={3}
            value={bytecode}
            onChange={this.onChangeBytecode.bind(this)}
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
          <div className={styles.bytecode}>{intl.formatMessage(messages.areaConstructor)}</div>
          <div className={styles.areaConstructor} ></div>
        </div>
        
        <div className={styles.borderedBox}>
          <div className={styles.areaLabel}>{intl.formatMessage(messages.areaOptional)}</div>
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
            label="Create Contract"
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
