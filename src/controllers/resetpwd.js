import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js'; 
import env from '../utils/env.js'; 

export const resetPasswordController = async (req, res, next) => {
  try {

    const { token, password } = req.body;

   
    let decoded;
    try {
      decoded = jwt.verify(token, env('JWT_SECRET'));
    } catch (err) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    user.password = hashedPassword;
    await user.save();


    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
