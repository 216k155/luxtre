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

type State = {
  bytecode: string,
};

@observer
export default class SolidityCompiler extends Component<State> {
  state = {
    bytecode: '',
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const { 
      bytecode, 
      } = this.state;
    
    const { intl } = this.context;
    
    const buttonClasses = classnames([
      'primary',
      //styles.button
    ]);

	const solpage = path.resolve('app/components/wallet/smartcontracts/solc/index.html');
	var solcUrl = 'file://' + solpage;
    return (
      <div className={styles.component}>
        <div className={styles.subTitle}> {intl.formatMessage(messages.title)} </div>
        <div className={styles.borderedBox}>
          <webview src={solcUrl} className={styles.solcViewRegion}> </webview>
        </div>
      </div>
    );
  }
}
