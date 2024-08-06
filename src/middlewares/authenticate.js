import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const session = await Session.findOne({ userId, accessToken: token });

    if (!session || new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = await User.findById(userId);
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
