import createHttpError from 'http-errors';
import { loginUserService, refreshSessionService, logoutUserService } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
  
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUserService(email, password);

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

    const { accessToken, newRefreshToken } = await refreshSessionService(refreshToken);

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

    if (!sessionId || !refreshToken) {
      throw createHttpError(400, 'Session ID and refresh token are required');
    }

    await logoutUserService(sessionId, refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};