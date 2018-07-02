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
  compileVersion: string,
  source: string,
  bytecode: string,
  abi: string,
  saveSoljsonSources: Function,
  saveSolc: Function
};

type State = {
  status: string,
  selVersion: string,
  compileVersion: string,
  source: string,
  bytecode:string,
  abi:string
};

var compiler;

@observer
export default class SolidityCompiler extends Component<Props, State> {
  state = {
    status: '',
    selVersion: this.props.compileVersion,
    compileVersion: this.props.compileVersion,
    source: this.props.source,
    bytecode: this.props.bytecode,
    abi: this.props.abi,
  };

  componentDidMount() {
    if (typeof SolCompiler == 'undefined') {
      throw new Error();
    }

    if(this.props.soljsonSources.length == 0) {
      this.setStatus("Loading Soljsons ...");
      SolCompiler.getVersions(this.getSoljsonVersion.bind(this));
    } else {
      if(this.props.compileVersion == '')
        this.setState({ selVersion: soljsonSources[0] });
      else {
        this.setState({ selVersion: this.props.compileVersion });
        
      }
    }
  }

  componentWillUnmount() {
    this.props.saveSolc(this.state.compileVersion, this.state.source, this.state.bytecode, this.state.abi);
  }
  
  getSoljsonVersion(soljsonSources, soljsonReleases) {
    this.props.saveSoljsonSources(soljsonSources);

    this.setStatus("Loaded Soljsons");
    this.setState({ selVersion: 'soljson-v0.4.25-nightly.2018.6.22+commit.9b67bdb3.js' });
    //this.setState({ selVersion: soljsonSources[0] });
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

    this.setStatus("Compiling ...");
    var result = compiler.compile(this.state.source, optimize);

    if(result.contracts != undefined) {
      for (let ch in result.contracts) {
        this.setState({bytecode : result.contracts[ch].bytecode});
        this.setState({abi : result.contracts[ch].interface});
        this.setStatus("Compile Success");
      }
    } else if(result.errors != undefined) {
      
      let pos = result.errors[0].indexOf("Error");
      if(pos != -1)
        this.setStatus(result.errors[0].substring(pos));
      else
        this.setStatus("Compile Error");
    }
  }

  setStatus(status) {
    this.setState({ status: status })
  }

  onChangeSolidityVersions(event) {
      this.setState({ selVersion: event.target.value });
  }

  onClickCompile() {
    if(compiler == undefined || this.state.compileVersion != this.state.selVersion) {
      this.setState( {compileVersion: this.state.selVersion} );

      this.setStatus("Loading Compiler ...");
      SolCompiler.loadVersion(this.state.selVersion, this.compileWithLoadingCompiler.bind(this));
    } else {
      this.compile();
    }
  }

  onChangeSource(value) {
    this.setState( {source: value});
  }

  onKeydownSourceEditor(event) {
    if (event.keyCode === 9) { // tab was pressed
      event.preventDefault();
      var val = this.state.source,
      start = event.target.selectionStart,
      end = event.target.selectionEnd;
      this.setState({"source": val.substring(0, start) + '\t' + val.substring(end)});
    }
  }

  render() {
    const { 
      status,
      selVersion,
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
            <select className={styles.selector} onChange={this.onChangeSolidityVersions.bind(this)} value={selVersion}>
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
              rows={30}
              value={source}
              onChange={this.onChangeSource.bind(this)}
              onKeyDown={this.onKeydownSourceEditor.bind(this)}
            />
          </div>
          <div className={styles.bytecode}>
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
