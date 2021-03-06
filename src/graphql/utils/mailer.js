import nodemailer from 'nodemailer';
// import Email from 'email-templates';
// import path from 'path';

import conf from './config';

export default nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: conf.get('mailer.user'),
    pass: conf.get('mailer.password'),
  },
});

export const renderTemplate = (file, locals = {}) => {
  console.log('render template', file, locals);
  // const templatesDir = path.resolve(__dirname, '..', 'templates');
  // const template = path.join(templatesDir, file);
  // const email = new Email({
  //   views: {
  //     options: {
  //       extension: 'ejs',
  //     },
  //   },
  // });
  // return Promise.all([
  //   email.render(`${template}/html`, locals),
  //   email.render(`${template}/subject`, locals),
  // ]);
};
