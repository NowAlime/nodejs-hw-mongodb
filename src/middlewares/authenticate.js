import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Перевірка токену
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Перевірка сесії
    const session = await Session.findOne({ userId, accessToken: token });

    if (!session || new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, 'Access token expired');
    }

    // Завантаження користувача
    req.user = await User.findById(userId);
    
    if (!req.user) {
      throw createHttpError(401, 'User not found');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
