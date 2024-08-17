import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  refreshUsersSessionController,
  logoutUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRouter = express.Router();
const parseJSON = express.json();

authRouter.post(
  '/register',
  parseJSON,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  parseJSON,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// Middleware authenticate застосовується тільки до захищених маршрутів
authRouter.post(
  '/logout',
  parseJSON,
  authenticate,
  ctrlWrapper(logoutUserController),
);

authRouter.post(
  '/refresh',
  parseJSON,
  authenticate,
  ctrlWrapper(refreshUsersSessionController),
);

export default authRouter;
