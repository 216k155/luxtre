// @flow
import React, { Component } from 'react';
import SvgInline from 'react-svg-inline';
import { ipcRenderer } from 'electron';
import { defineMessages, intlShape } from 'react-intl';
import styles from './About.scss';
import luxIcon from '../../assets/images/lux-logo-loading-grey.inline.svg';
import luxIcon from '../../assets/images/lux-logo.inline.svg';

const messages = defineMessages({
  aboutWindowTitle: {
    id: 'window.about.title',
    defaultMessage: '!!!About Lux',
    description: 'About Window "title"',
  },
  aboutTitle: {
    id: 'static.about.title',
    defaultMessage: '!!!Lux',
    description: 'About "title"',
  },
  aboutReleaseVersion: {
    id: 'static.about.release.version',
    defaultMessage: '!!!0.8.2',
    description: 'Label for "App Release Version"',
  },
  aboutContentLuxHeadline: {
    id: 'static.about.content.lux.headline',
    defaultMessage: '!!!Lux Team:',
    description: 'About page lux team headline',
  },
  aboutContentLuxHeadline: {
    id: 'static.about.content.lux.headline',
    defaultMessage: '!!!Lux Team:',
    description: 'About page lux team headline',
  },
  aboutContentLuxMembers: {
    id: 'static.about.content.lux.members',
    defaultMessage: '!!!Alexander Rukin, Charles Hoskinson, Darko Mijić, Dominik Guzei, Jeremy Wood, Nikola Glumac, Richard Wild, Tomislav Horaček',
    description: 'About page lux team members',
  },
  aboutContentLuxMembers: {
    id: 'static.about.content.lux.members',
    defaultMessage: '!!!Alexander Sukhoverkhov, Alexander Vieth, Alexandre Rodrigues Baldé, Alfredo Di Napoli, Anastasiya Besman, Andrzej Rybczak, Ante Kegalj, Anton Belyy, Anupam Jain, Arseniy Seroka, Artyom Kazak, Carlos D\'Agostino, Charles Hoskinson, Dan Friedman, Denis Shevchenko, Dmitry Kovanikov, Dmitry Mukhutdinov, Dmitry Nikulin, Domen Kožar, Duncan Coutts, Edsko de Vries, Eileen Fitzgerald, George Agapov, Hiroto Shioi, Ilya Lubimov, Ilya Peresadin, Ivan Gromakovskii, Jake Mitchell, Jane Wild, Jens Krause, Jeremy Wood, Joel Mislov Kunst, Jonn Mostovoy, Konstantin Ivanov, Kristijan Šarić, Lars Brünjes, Laurie Wang, Lionel Miller, Michael Bishop, Mikhail Volkhov, Niklas Hambüchen, Peter Gaži, Philipp Kant, Serge Kosyrev, Vincent Hanquez',
    description: 'About page lux team members',
  },
  aboutCopyright: {
    id: 'static.about.copyright',
    defaultMessage: '!!!Input Output HK Limited. Licensed under',
    description: 'About "copyright"',
  },
  licenseLink: {
    id: 'static.about.license',
    defaultMessage: '!!!MIT licence',
    description: 'About page license name',
  },
});

export default class About extends Component<any> {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  componentWillMount() {
    ipcRenderer.send('about-window-title', this.context.intl.formatMessage(messages.aboutWindowTitle));
  }

  render() {
    const { intl } = this.context;

    return (
      <div className={styles.container}>

        <div className={styles.headerWrapper}>

          <SvgInline svg={luxIcon} className={styles.luxIcon} />

          <div className={styles.luxTitleVersion}>
            <div className={styles.luxTitle}>
              {intl.formatMessage(messages.aboutTitle)}
            </div>
            <div className={styles.luxVersion}>
              {intl.formatMessage(messages.aboutReleaseVersion)}
            </div>
          </div>

          <SvgInline svg={luxIcon} className={styles.luxIcon} />
        </div>

        <div className={styles.contentText}>

          <h2>{intl.formatMessage(messages.aboutContentLuxHeadline)}</h2>

          <div className={styles.contentLux}>
            {intl.formatMessage(messages.aboutContentLuxMembers)}
          </div>

          <h2>{intl.formatMessage(messages.aboutContentLuxHeadline)}</h2>

          <div className={styles.contentLuxMembers}>
            {intl.formatMessage(messages.aboutContentLuxMembers)}
          </div>

        </div>

        <div className={styles.footerWrapper}>
          <a href="http://luxwallet.io">http://luxwallet.io</a>
          <div className={styles.copyright}>
            {intl.formatMessage(messages.aboutCopyright)}&nbsp;
            <a href="https://github.com/216k155/luxcore/blob/master/LICENSE">
              {intl.formatMessage(messages.licenseLink)}
            </a>
          </div>
        </div>

      </div>
    );
  }
}
