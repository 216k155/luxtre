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
import styles from './SolidityCompiler.scss';
import path from 'path';

export const messages = defineMessages({
  title: {
    id: 'smartcontract.solcompiler.title',
    defaultMessage: '!!!Solidity Compiler',
    description: 'Title "Solidity Compiler" in the Smart Contract.'
  },
});

type Props = {
  soljsonSources: Array<string>,
  bytecode: string,
  abi: string,
  compileVersion: string,
  saveSoljsonSources: Function,
  saveSolc: Function
};

type State = {
  status: string,
  selVersion: string,
  compileVersion: string,
  bytecode:string,
  abi:string,
  source:string
};

var compiler;

@observer
export default class SolidityCompiler extends Component<Props, State> {
  state = {
    status: '',
    selVersion: this.props.compileVersion,
    compileVersion: this.props.compileVersion,
    bytecode: this.props.bytecode,
    abi: this.props.abi,
    source: ''
  };

  componentDidMount() {
    if (typeof SolCompiler == 'undefined') {
      throw new Error();
    }

    if(this.props.soljsonSources.length == 0) {
      this.setStatus("Loading Soljsons ...");
      SolCompiler.getVersions(this.getSoljsonVersion.bind(this));
    }
  }

  componentWillUnmount() {
    this.props.saveSolc(this.state.compileVersion, this.state.bytecode, this.state.abi);
  }
  
  getSoljsonVersion(soljsonSources, soljsonReleases) {
    this.props.saveSoljsonSources(soljsonSources);

    this.setStatus("Loaded Soljsons");
    this.setState({ selVersion: soljsonSources[0] });
  }

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  async compileWithLoadingCompiler(c) {
    compiler = Object.assign({}, c);
    this.compile();
  }

  async compile() {
    var optimize = 1;
    var result = compiler.compile(this.state.source, optimize);

    for (let ch in result.contracts) {
        this.setState({bytecode : result.contracts[ch].bytecode});
        this.setState({abi : result.contracts[ch].interface});
        break;
    }
  }

  setStatus(status) {
    this.setState({ status: status })
  }

  onChangeSolidityVersions(event) {
      this.setState({ selVersion: event.target.value });
  }

  onClickCompile() {
    if(this.state.compileVersion != this.state.selVersion) {
      this.setState( {compileVersion: this.state.selVersion} );
      SolCompiler.loadVersion(this.state.selVersion, this.compileWithLoadingCompiler.bind(this));
    } else {
      SolCompiler.loadVersion(this.state.selVersion, this.compile.bind(this));
    }
  }

  onChangeSource(value) {
    this.setState( {source: value});
  }

  render() {
    const { 
      status,
      bytecode,
      abi, 
      source
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
          <div className={styles.setting}>
            <label>Solidity version</label>
            <select className={styles.selector} onChange={this.onChangeSolidityVersions.bind(this)}>
            {
              this.props.soljsonSources.map((source, index) => {
                return (
                  <option key={`tr-${index}`} value={source}> {source} </option>
                )
              })
            }
            </select>
            <Button 
              className={buttonClasses}
              label="Compile"
              onClick={this.onClickCompile.bind(this)}
              skin={<SimpleButtonSkin/>}
              />
            <div className={styles.loader}></div>
            <div className={styles.status}>{status}</div>
          </div>
          <div>
            <TextArea
              className={styles.solEditor}
              skin={<TextAreaSkin />}
              rows={24}
              value={source}
              onChange={this.onChangeSource.bind(this)}
            />
          </div>
          <div className={styles.interface}>
            <div>Bytecode: </div>
            <textarea className={styles.output} value={bytecode} />
          </div>
          <div className={styles.abi}>
            <div>ABI: </div>
            <textarea className={styles.output} value={abi} />
          </div>
        </div>
      </div>
    );
  }
}
