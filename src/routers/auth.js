import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema } from '../validation/auth.js';
import { loginUser } from '../controllers/auth.js';

const router = express.Router();
router.post('/auth/register', validateBody(registerUserSchema), registerUser);
router.post('/auth/login', validateBody(loginSchema), loginUser);
router.post('/auth/refresh', refreshSession);
router.post('/auth/logout', validateBody(logoutSchema), logoutUser);
export default router;
