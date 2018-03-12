// @flow
import React, { Component } from 'react';
import SvgInline from 'react-svg-inline';
import { ipcRenderer } from 'electron';
import { defineMessages, intlShape } from 'react-intl';
import styles from './About.scss';
import luxcoreIcon from '../../assets/images/luxcore-logo-loading-grey.inline.svg';
import luxcoinIcon from '../../assets/images/luxcoin-logo.inline.svg';

const messages = defineMessages({
  aboutWindowTitle: {
    id: 'window.about.title',
    defaultMessage: '!!!About Luxcore',
    description: 'About Window "title"',
  },
  aboutTitle: {
    id: 'static.about.title',
    defaultMessage: '!!!Luxcore',
    description: 'About "title"',
  },
  aboutReleaseVersion: {
    id: 'static.about.release.version',
    defaultMessage: '!!!0.8.2',
    description: 'Label for "App Release Version"',
  },
  aboutContentLuxcoreHeadline: {
    id: 'static.about.content.luxcore.headline',
    defaultMessage: '!!!Luxcore Team:',
    description: 'About page luxcore team headline',
  },
  aboutContentLuxcoinHeadline: {
    id: 'static.about.content.luxcoin.headline',
    defaultMessage: '!!!Luxcoin Team:',
    description: 'About page luxcoin team headline',
  },
  aboutContentLuxcoreMembers: {
    id: 'static.about.content.luxcore.members',
    defaultMessage: '!!!Alexander Rukin, Charles Hoskinson, Darko Mijić, Dominik Guzei, Jeremy Wood, Nikola Glumac, Richard Wild, Tomislav Horaček',
    description: 'About page luxcore team members',
  },
  aboutContentLuxcoinMembers: {
    id: 'static.about.content.luxcoin.members',
    defaultMessage: '!!!Alexander Sukhoverkhov, Alexander Vieth, Alexandre Rodrigues Baldé, Alfredo Di Napoli, Anastasiya Besman, Andrzej Rybczak, Ante Kegalj, Anton Belyy, Anupam Jain, Arseniy Seroka, Artyom Kazak, Carlos D\'Agostino, Charles Hoskinson, Dan Friedman, Denis Shevchenko, Dmitry Kovanikov, Dmitry Mukhutdinov, Dmitry Nikulin, Domen Kožar, Duncan Coutts, Edsko de Vries, Eileen Fitzgerald, George Agapov, Hiroto Shioi, Ilya Lubimov, Ilya Peresadin, Ivan Gromakovskii, Jake Mitchell, Jane Wild, Jens Krause, Jeremy Wood, Joel Mislov Kunst, Jonn Mostovoy, Konstantin Ivanov, Kristijan Šarić, Lars Brünjes, Laurie Wang, Lionel Miller, Michael Bishop, Mikhail Volkhov, Niklas Hambüchen, Peter Gaži, Philipp Kant, Serge Kosyrev, Vincent Hanquez',
    description: 'About page luxcoin team members',
  },
  aboutCopyright: {
    id: 'static.about.copyright',
    defaultMessage: '!!!Luxcore Limited. Licensed under',
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

          <SvgInline svg={luxcoreIcon} className={styles.luxcoreIcon} />

          <div className={styles.luxcoreTitleVersion}>
            <div className={styles.luxcoreTitle}>
              {intl.formatMessage(messages.aboutTitle)}
            </div>
            <div className={styles.luxcoreVersion}>
              {intl.formatMessage(messages.aboutReleaseVersion)}
            </div>
          </div>

          <SvgInline svg={luxcoinIcon} className={styles.luxcoinIcon} />
        </div>

        <div className={styles.contentText}>

          <h2>{intl.formatMessage(messages.aboutContentLuxcoreHeadline)}</h2>

          <div className={styles.contentLuxcore}>
            {intl.formatMessage(messages.aboutContentLuxcoreMembers)}
          </div>

          <h2>{intl.formatMessage(messages.aboutContentLuxcoinHeadline)}</h2>

          <div className={styles.contentLuxcoinMembers}>
            {intl.formatMessage(messages.aboutContentLuxcoinMembers)}
          </div>

        </div>

        <div className={styles.footerWrapper}>
          <a href="http://luxcorewallet.io">http://luxcorewallet.io</a>
          <div className={styles.copyright}>
            {intl.formatMessage(messages.aboutCopyright)}&nbsp;
            <a href="https://github.com/Luxcore/luxcore/blob/master/LICENSE">
              {intl.formatMessage(messages.licenseLink)}
            </a>
          </div>
        </div>

      </div>
    );
  }
}
