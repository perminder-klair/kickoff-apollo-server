import { generateSignedUrl } from '../utils/aws-s3';
import { isLoggedIn } from '../utils/auth';
import logger from '../utils/logger';
import mailer, { renderTemplate } from '../utils/mailer';
import config from '../utils/config';

export default {
  Query: {
    hello: () => {
      logger.info('This is a hello query!');

      return 'Hello world!';
    },
  },
  Mutation: {
    getSignedUploadUrl: async (root, args, ctx) => {
      await isLoggedIn(ctx);

      return generateSignedUrl({
        fileKey: args.fileKey,
        fileType: args.fileType,
      });
    },
    contact: async (root, args) => {
      // console.log('contact', args.input);
      const [html, subject, text] = await renderTemplate('contact', args.input);

      const result = await mailer.sendMail({
        from: config.get('adminEmail'),
        to: config.get('adminEmail'),
        subject,
        text,
        html,
      });
      console.log('mail sent', result);

      return { success: true };
    },
  },
};
