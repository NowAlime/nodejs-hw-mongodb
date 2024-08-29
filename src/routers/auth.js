import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = express.Router();
const parseJSON = express.json();

router.post(
  '/register',
  parseJSON,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login', parseJSON, validateBody(loginUserSchema), ctrlWrapper(loginUserController),
);

router.post('/logout', parseJSON, ctrlWrapper(logoutUserController));

router.post('/refresh', parseJSON, ctrlWrapper(refreshUserSessionController));

router.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController),
);

router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController),
);

export default router;





