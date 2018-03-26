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
  aboutContentLuxcoreMembers: {
    id: 'static.about.content.luxcore.members',
    defaultMessage: '!!!Brian Oliver, 216K155, Cosmin Tudor, Brian F., Hari Sadasivan, Sebastian Berger, Eric Juta, Guillaume Huot, Tran Nguyen, Maxim Dzekelev, Ilya Tereshin (Arslan), John Kim, Ben Wellington, David Olschan-Wilson, Paul P., Zach Forsyth, Lucas Marshall, SecretAgentMan, Leo Patino (TopoX)',
    description: 'About page luxcore team members',
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

        </div>

        <div className={styles.footerWrapper}>
          <a href="https://luxcore.io">https://luxcore.io</a>
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
