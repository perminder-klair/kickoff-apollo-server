import winston from 'winston';
// import LogdnaWinston from 'logdna-winston';
// import os from 'os';
// import config from './config';

// const logdnaKey = config.get('logdnaKey');
// const logdnaApp = config.get('logdnaKey');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // new LogdnaWinston({
    //   key: logdnaKey,
    //   hostname: os.hostname(),
    //   // ip: os.networkInterfaces().lo0[0].address,
    //   // mac: os.networkInterfaces().lo0[0].mac,
    //   app: logdnaApp,
    //   env: process.env.NODE_ENV,
    //   // level: 'info', // Uses Winston log levels: https://github.com/winstonjs/winston#logging-levels
    //   handleExceptions: true,
    // }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
});

export default logger;
