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
import styles from './CreateSmartContract.scss';
import ContractSummaryDialog from './ContractSummaryDialog';
import ContractSummaryDialogContainer from '../../../containers/wallet/dialogs/ContractSummaryDialogContainer';
import Web3EthAbi from 'web3-eth-abi';

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

type Props = {
  createContract: Function,
  openDialogAction: Function,
  saveContract: Function,
  bytecode: string,
  abi: string,
  gaslimit: number,
  gasprice: number,
  senderaddress: string,
  isDialogOpen: Function,
  error: ?LocalizableError
};

type State = {
  bytecode: string,
  abi: string,
  arrInputs : Array<Object>,
  gasLimit: number,
  gasPrice: number,
  senderAddress: string
};

@observer
export default class CreateSmartContract extends Component<Props, State> {
  state = {
    bytecode: this.props.bytecode,
    abi: this.props.abi,
    arrInputs:[],
    gasLimit: this.props.gaslimit,
    gasPrice: this.props.gasprice,
    senderAddress: this.props.senderaddress
  };

  _isMounted = false;
  
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.saveContract(this.state.bytecode, this.state.abi, this.state.gasLimit, this.state.gasPrice, this.state.senderAddress);
  }

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  onChangeBytecode(value) {
    if(value != this.state.bytecode)
      this.setState( {bytecode: value});
  }

  onChangeABI(value) {
    if(value != this.state.abi) {
      this.setState( {abi: value});
      if(value == "") {
        this.setState( {arrInputs: []} );
      } else {
        try {
          let arrABI = JSON.parse(value);
          let element = arrABI.find((data) => { return data.type == "constructor" });
          if(element !== undefined) {
            this.setState( {arrInputs: element.inputs});
          } else {
            this.setState( {arrInputs: []} );
          }
        } catch (error) {
          
        }
      }
    }
  }

  onClickClearAll() {
    this.setState({
      bytecode: '',
      abi: '',
      arrInputs:[],
      gasLimit: 2500000,
      gasPrice: 0.0000004,
      senderAddress: ''
    })
  }

  async _createContract() {
    try {
      let bytecode = this.state.bytecode;
      for(var i = 0; i < this.state.arrInputs.length; i++)
      {
        var parameter = this.refs['constructor_parameter' + i].value;
        if(parameter == null || parameter == '')
          return;

        var encoded = Web3EthAbi.encodeParameter(this.state.arrInputs[i].type, parameter);
        bytecode += encoded;
      }

      let senderaddress = this.state.senderAddress !== '' ? this.state.senderAddress : null;
      let gasLimit = this.state.gasLimit !== '' ? this.state.gasLimit : 2500000;
      let gasPrice = this.state.gasPrice !== '' ? this.state.gasPrice : 0.0000004;
      const outputs = await this.props.createContract(bytecode, gasLimit, gasPrice, senderaddress);
      if (this._isMounted) {
        this.setState({
          outputs: outputs,
          outputsError: null,
        });
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
      bytecode, 
      abi, 
      arrInputs,
      gasLimit,
      gasPrice,
      senderAddress
      } = this.state;
    
    const { intl } = this.context;
    
    const {
      openDialogAction, 
      isDialogOpen,
      createContract,
      error
    } = this.props;

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
          <div className={styles.areaConstructor} >
          {
            arrInputs.map((data, index) => {
              return (
                <div key={`con-${index}`} className={styles.tokenElement}>
                  <div className={styles.solVariable}>
                    <span className={styles.solTypeColor}>{data.type}</span>
                    <span className={styles.solVariableLabel}>{data.name}</span>
                  </div>
                  <input  ref={'constructor_parameter'+index} className={styles.tokenInputBox} type="text"/>
                </div>
              )
            })
          }
          </div>
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
            onClick={() => {
              this._createContract();
              openDialogAction({dialog: ContractSummaryDialog});
            }}
            label="Create Contract"
            skin={<SimpleButtonSkin/>}
          />
          <Button
            className={buttonClasses}
            label="Clear All"
            skin={<SimpleButtonSkin/>}
            onClick={this.onClickClearAll.bind(this)}
          />
        </div>
        {isDialogOpen(ContractSummaryDialog) ? (
          <ContractSummaryDialogContainer 
            outputs = {this.state.outputs}
            error = {error}
          />
        ) : null}
      </div>
    );
  }
}
