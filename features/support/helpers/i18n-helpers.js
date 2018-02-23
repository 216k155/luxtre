const DEFAULT_LANGUAGE = 'en-US';

export default {
  formatMessage: async (client, { id, values }) => {
    const translation = await client.execute((translationId, translationValues) => {
      const IntlProvider = require('react-intl').IntlProvider; // eslint-disable-line
      const locale = lux.stores.profile.currentLocale;
      const messages = lux.translations;
      const intlProvider = new IntlProvider({ locale, messages: messages[locale] }, {});
      return intlProvider.getChildContext()
        .intl.formatMessage({ id: translationId }, translationValues);
    }, id, values || {});
    return translation.value;
  },
  setActiveLanguage: async (client, { language } = {}) => (
    await client.execute(locale => {
      lux.actions.profile.updateLocale.trigger({ locale });
    }, language || DEFAULT_LANGUAGE)
  )
};
