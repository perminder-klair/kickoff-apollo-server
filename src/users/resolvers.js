import { isEmpty } from 'lodash';
import randomstring from 'randomstring';

import { generateToken, isLoggedIn } from '../utils/auth';
import User from './database';
import mailer, { renderTemplate } from '../utils/mailer';
import config from '../utils/config';

export default {
  Query: {
    me: async (root, args, ctx) => {
      const me = await isLoggedIn(ctx);

      return User.findOne({ _id: me.id });
    },
  },
  Mutation: {
    register: async (root, args) => {
      const { email, password } = args.input;
      let user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        throw new Error('E-mail already registered.');
      }

      const data = {
        email,
        password,
      };

      user = new User(data);
      await user.save();

      // send welcome email
      const [html, subject] = await renderTemplate('welcome', {
        user,
      });
      const mailOptions = {
        to: `"${config.get('siteName')}" <${user.email}>`,
        from: config.get('adminEmail'),
        subject,
        html,
      };
      await mailer.sendMail(mailOptions);

      const token = generateToken(user);
      return { user, jwt: token };
    },
    login: async (root, args) => {
      const user = await User.findOne({ email: args.input.email });
      if (!user) {
        throw new Error('Invalid username or password.');
      }
      const isPasswordValid = await user.comparePassword(args.input.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password.');
      }

      const token = generateToken(user);
      return { user, jwt: token };
    },
    updateMe: async (root, { input }, ctx) => {
      const me = await isLoggedIn(ctx);

      const objUpdate = {};
      const objFind = { _id: me.id };

      // update user
      if (input.email) {
        objUpdate.email = input.email;
      }

      // if user obj not empty
      if (!isEmpty(objUpdate)) {
        await User.updateOne(objFind, objUpdate);
      }

      return User.findOne({ _id: me.id });
    },
    forgotPassword: async (root, { input }) => {
      const resetPasswordToken = randomstring.generate();
      const webAppUrl = config.get('webAppUrl');

      await User.updateOne({ email: input.email }, { resetPasswordToken });

      const [html, subject] = await renderTemplate('forgot-password', {
        // eslint-disable-next-line max-len
        resetPasswordLink: `${webAppUrl}/auth/set-password?token=${resetPasswordToken}`,
      });
      const mailOptions = {
        to: `"${config.get('siteName')}" <${input.email}>`,
        from: config.get('adminEmail'),
        subject,
        html,
      };
      await mailer.sendMail(mailOptions);

      return { success: true };
    },
    setNewPassword: async (root, { input }) => {
      const user = await User.findOne({ resetPasswordToken: input.token });

      if (!user) {
        throw new Error('Invalid password reset token provided.');
      }

      user.password = input.password;
      user.resetPasswordToken = null;
      await user.save();

      return { success: true };
    },
  },
};
