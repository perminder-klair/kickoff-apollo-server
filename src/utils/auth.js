import jwt from 'jsonwebtoken';
import conf from './config';

export const isAuthenticated = async (req) => {
  if (!req.headers.authorization) {
    return undefined;
  }

  const token = req.headers.authorization.substring(4);
  const data = await new Promise((resolve) => {
    jwt.verify(token, conf.get('jwtSecret'), (err, decoded) => {
      if (err) {
        return resolve(null);
      }
      return resolve(decoded);
    });
  });

  return data;
};

export function generateToken(user) {
  const jwtToken = jwt.sign(
    // eslint-disable-next-line no-underscore-dangle
    { id: user._id, email: user.email },
    conf.get('jwtSecret'),
  );
  return `JWT ${jwtToken}`;
}

export async function isLoggedIn(ctx) {
  if (!ctx.user) {
    throw new Error('Not logged in');
  }
  return ctx.user;
}
