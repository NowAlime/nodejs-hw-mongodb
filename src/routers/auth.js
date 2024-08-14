import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginSchema } from '../schemas/auth.js';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser
} from '../controllers/auth.js';

const router = express.Router();
const parseJSON = express.json();

router.post(
  '/register',
  parseJSON,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUser)
);

router.post(
  '/login',
  parseJSON,
  validateBody(loginSchema),
  ctrlWrapper(loginUser)
);

router.post('/logout', parseJSON, ctrlWrapper(logoutUser));

router.post('/refresh', parseJSON, ctrlWrapper(refreshSession));

export default router;
