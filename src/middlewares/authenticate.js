import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    if (new Date() > new Date(user.accessTokenValidUntil)) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
