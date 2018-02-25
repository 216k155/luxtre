// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ThemeProvider } from 'react-css-themr';
import { IntlProvider } from 'react-intl';
import AboutPage from './containers/static/AboutPage';
import { luxTheme } from './themes/lux';
import translations from './i18n/translations';
import type { StoresMap } from './stores/index';
import ThemeManager from './ThemeManager';

type Props = { stores: StoresMap };

@observer
export default class About extends Component<Props> {
  render() {
    const { stores } = this.props;
    const locale = stores.profile.currentLocale;
    const currentTheme = stores.profile.currentTheme;
    const theme = require(`./themes/lux/${currentTheme}.js`); // eslint-disable-line

    return (
      <div>
        <ThemeManager variables={theme} />
        <ThemeProvider theme={luxTheme}>
          <IntlProvider {...{ locale, key: locale, messages: translations[locale] }}>
            <AboutPage />
          </IntlProvider>
        </ThemeProvider>
      </div>
    );
  }
}