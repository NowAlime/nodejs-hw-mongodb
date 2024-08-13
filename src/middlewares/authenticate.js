import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw createHttpError(401, 'No authorization header');

    const token = authHeader.split(' ')[1];
    if (!token) throw createHttpError(401, 'No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId };

    next();
  } catch (error) {
    next(createHttpError(401, 'Access token expired'));
  }
};