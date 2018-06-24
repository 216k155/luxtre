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
    const { saveSolc, saveSoljsonSources, soljsonSources, solc_version, solc_source, solc_bytecode, solc_abi } = contracts;
    
    return (
      <SolidityCompiler
        soljsonSources={soljsonSources}
        compileVersion={solc_version}
        source={solc_source}
        bytecode={solc_bytecode}
        abi={solc_abi}
        saveSoljsonSources={(sources) => (saveSoljsonSources(sources))}
        saveSolc={(compileVersion, source, bytecode, abi) => (
          saveSolc({compileVersion: compileVersion, source:source, bytecode: bytecode, abi: abi})
        )}
      />
    );
  }

}
