/* eslint-disable no-undef */
import fs from 'fs';
import convict from 'convict';
import dotenv from 'dotenv';

// to load .env file
dotenv.config();

const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  appName: {
    doc: 'App Name',
    format: String,
    default: 'Kickoff Apollo Server',
    env: 'APP_NAME',
  },
  webAppUrl: {
    doc: 'Web app url',
    format: String,
    default: 'https://www.mysite.com',
    env: 'WEB_APP_URL',
  },
  mongodb: {
    doc: 'URL to mongodb.',
    format: String,
    default: '',
    env: 'MONGODB',
  },
  adminEmail: {
    doc: 'Admin email ',
    format: String,
    default: 'no-reply@site.com',
    env: 'ADMIN_EMAIL',
  },
  jwtSecret: {
    doc: 'JWT secret.',
    format: String,
    default: 'MY_SITE_SECRET',
    env: 'JWTSECRET',
  },
  mailer: {
    user: {
      doc: 'Mailer user.',
      format: String,
      default: '',
    },
    password: {
      doc: 'Mailer password.',
      format: String,
      default: '',
    },
  },
  aws: {
    bucket: {
      doc: 'S3 Bucket name.',
      format: String,
      default: '',
      env: 'AWS_BUCKET',
    },
    region: {
      doc: 'S3 Region.',
      format: String,
      default: 'us-west-2',
    },
    identityPoolId: {
      doc: 'AWS IDENTITY_POOL_ID',
      format: String,
      default: '',
      env: 'AWS_POOL_ID',
    },
  },
  logdnaKey: {
    doc: 'Logdna Logger Key.',
    format: String,
    default: '',
    env: 'LOGDNA_KEY',
  },
});

const env = conf.get('env');
try {
  const path = `${__dirname}/${env}.json`;

  console.log('trying to access %s', path);
  fs.accessSync(path, fs.F_OK);

  conf.loadFile(path);
} catch (error) {
  console.log("file doesn't exist, loading defaults");
}

conf.validate({ allowed: 'strict' });

export default conf;
