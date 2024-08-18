import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema,  resetPasswordSchema  } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  refreshUsersSessionController,
  logoutUserController,
  resetPasswordController,
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

authRouter.post(
  '/reset-password',
  parseJSON,
  validateBody(resetPasswordSchema), 
  ctrlWrapper(resetPasswordController),
);


export default authRouter;
