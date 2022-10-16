/* eslint-disable no-underscore-dangle */
import { isEmpty } from 'lodash';
import randomstring from 'randomstring';
import { ApolloError, AuthenticationError } from 'apollo-server';

import { generateToken, isLoggedIn } from '../utils/auth';
import User from './database';
import mailer, { renderTemplate } from '../utils/mailer';
import config from '../utils/config';
import { cleanString } from '../utils/helpers';

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
      const cleanEmail = cleanString(email);

      let user = await User.findOne({ email: cleanEmail });

      if (user) {
        throw new Error('E-mail already registered.');
      }

      const data = {
        email: cleanEmail,
        password,
      };

      user = new User(data);
      await user.save();

      // send welcome email
      // const [html, subject] = await renderTemplate('welcome', {
      //   user,
      // });
      // const mailOptions = {
      //   to: `"${config.get('siteName')}" <${user.email}>`,
      //   from: config.get('adminEmail'),
      //   subject,
      //   html,
      // };
      // await mailer.sendMail(mailOptions);

      const token = generateToken(user);
      return { user, jwt: token };
    },
    login: async (root, args) => {
      const cleanEmail = cleanString(args.input.email);

      const user = await User.findOne({ email: cleanEmail });
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
    //
    // const me = await isLoggedIn(ctx);
    updateMe: async (root, args, ctx) => {
      if (!ctx.user) {
        throw new AuthenticationError('Not logged in');
      }

      const objFind = { _id: ctx.user.id };
      const user = await User.findOne(objFind);

      if (user === null) {
        throw new ApolloError('Invalid user, or user not found');
      }

      const { email, profile } = args.input;
      const objUpdate = {};

      if (email) {
        objUpdate.email = cleanString(email);
        // check if email already exists in db, throw error
        const duplicateEmail = await User.findOne({
          email: cleanString(email),
          _id: { $ne: user._id },
        });
        if (duplicateEmail) {
          throw new AuthenticationError(
            'Email already exists, please use another.',
          );
        }
      }

      if (profile) {
        objUpdate.profile = { ...user.profile, ...profile };
      }

      // finally update user in db
      try {
        await User.updateOne(objFind, { $set: objUpdate });
      } catch (e) {
        throw new Error('Unable to update user data', e.message);
      }

      return User.findOne(objFind);
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
