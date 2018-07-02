// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import TopBar from '../../components/layout/TopBar';
import TopBarLayout from '../../components/layout/TopBarLayout';
import TermsOfUseForm from '../../components/profile/terms-of-use/TermsOfUseForm';
import type { InjectedProps } from '../../types/injectedPropsType';

@inject('stores', 'actions') @observer
export default class TermsOfUseForLuxgatePage extends Component<InjectedProps> {

  static defaultProps = { actions: null, stores: null };

  onSubmit = () => {
    this.props.actions.profile.acceptTermsOfUseForLuxgate.trigger();
  };

  render() {
    const { setTermsOfUseForLuxgateAcceptanceRequest, termsOfUseForLuxgate } = this.props.stores.profile;
    const { currentRoute } = this.props.stores.app;
    const isSubmitting = setTermsOfUseForLuxgateAcceptanceRequest.isExecuting;
    const topbar = <TopBar isShowingLuxtre={this.props.stores.sidebar.isShowingLuxtre} />;
    return (
      <TopBarLayout
        topbar={topbar}
      >
        <TermsOfUseForm
          localizedTermsOfUse={termsOfUseForLuxgate}
          onSubmit={this.onSubmit}
          isSubmitting={isSubmitting}
          error={setTermsOfUseForLuxgateAcceptanceRequest.error}
        />
      </TopBarLayout>
    );
  }
}
