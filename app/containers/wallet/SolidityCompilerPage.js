// @flow
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import SolidityCompiler from '../../components/wallet/smartcontracts/SolidityCompiler';
import type { InjectedProps } from '../../types/injectedPropsType';

type Props = InjectedProps

@inject('stores', 'actions') @observer
export default class SolidityCompilerPage extends Component<Props> {

  static defaultProps = { actions: null, stores: null };

  render() {
    const { intl } = this.context;
    const actions = this.props.actions;
    const { contracts, } = this.props.stores.lux;
    const { saveSolc, saveSoljsonSources, soljsonSources, solc_bytecode, solc_abi, solc_version } = contracts;
    
    return (
      <SolidityCompiler
        soljsonSources={soljsonSources}
        bytecode={solc_bytecode}
        abi={solc_abi}
        compileVersion={solc_version}
        saveSoljsonSources={(sources) => (saveSoljsonSources(sources))}
        saveSolc={(compileVersion, bytecode, abi) => (
          saveSolc({compileVersion: compileVersion, bytecode: bytecode, abi: abi})
        )}
      />
    );
  }

}
