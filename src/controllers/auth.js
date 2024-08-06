import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (await User.findOne({ email })) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        user: {
          email: newUser.email,
          name: newUser.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
};



export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createHttpError(401, 'Invalid email or password');
    }

    await Session.deleteMany({ userId: user._id });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    await new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }).save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
};


export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const session = await Session.findOne({ userId, refreshToken });

    if (!session || new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    await Session.deleteMany({ userId });

    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    await new Session({
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }).save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const { refreshToken } = req.cookies;

    const session = await Session.findOneAndDelete({ _id: sessionId, refreshToken });

    if (!session) {
      throw createHttpError(404, 'Session not found');
    }

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};