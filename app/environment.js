// @flow
const environment = Object.assign({
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
  NETWORK: process.env.NETWORK,
  PLATFORM: process.platform,
  ENV: process.env,
  API: process.env.API || 'lux',
  MOBX_DEV_TOOLS: process.env.MOBX_DEV_TOOLS,
  current: process.env.NODE_ENV,
  isDev: () => environment.current === environment.DEVELOPMENT,
  isTest: () => environment.current === environment.TEST,
  isProduction: () => environment.current === environment.PRODUCTION,
  isMainnet: () => environment.NETWORK === 'mainnet',
  isLuxApi: () => environment.API === 'lux',
}, process.env);

export default environment;
