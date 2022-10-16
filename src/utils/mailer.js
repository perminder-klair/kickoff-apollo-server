import path from 'path';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import mjml2html from 'mjml';

import conf from './config';

const fs = require('fs').promises;

export const templatesDir = path.resolve(
  process.cwd(),
  'src',
  'templates',
);

export default nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: conf.get('mailer.user'),
    pass: conf.get('mailer.password'),
  },
});

export const renderTemplate = async (file, locals = {}) => {
  const template = path.join(templatesDir, file);

  const email = new Email({
    send: false,
    views: {
      options: {
        extension: 'ejs',
        // map: { js: 'react' },
      },
    },
    preview: {
      open: {
        app: 'safari',
        // wait: false,
      },
    },
  });

  return Promise.all([
    email.render(`${template}/html`, locals),
    email.render(`${template}/subject`, locals),
  ]);
};

export const convertMjmlToEjs = async (templateName) => {
  const mjmlDirectory = `${templatesDir}/${templateName}`;
  const inputFile = `${mjmlDirectory}/template.mjml`;
  console.log('inputFile', inputFile);

  try {
    const exists = await fs.access(inputFile);

    if (exists === undefined) {
      const mjmlData = await fs.readFile(inputFile, 'binary');
      // console.log('mjmlData', mjmlData);

      const options = { keepComments: false };
      const htmlOutput = mjml2html(mjmlData, options);
      // console.log('htmlOutput', htmlOutput.html);

      await fs.writeFile(`${mjmlDirectory}/html.ejs`, htmlOutput.html);
    }
  } catch (err) {
    console.log(err);
  }
};
