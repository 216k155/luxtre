import Log from 'electron-log';
import winston from 'winston';

// Requiring `winston-papertrail` will expose
// `winston.transports.Papertrail`
require('winston-papertrail').Papertrail; // eslint-disable-line

const papertrailConfiguration = {
  host: 'logs5.papertrailapp.com',
  port: 43689,
};

const winstonPapertrailLuxcore = new winston.transports.Papertrail(
  Object.assign({}, papertrailConfiguration, {
    program: 'Luxcore'
  })
);

winstonPapertrailLuxcore.on('error', (error: Error) => {
  Log.error('Error connecting to papertrail logging service for Luxcore', error);
});

export const luxcoreLogger = new winston.Logger({
  transports: [winstonPapertrailLuxcore]
});
