import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginSchema, refreshSchema, logoutSchema } from '../schemas/auth.js';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';

const router = express.Router();
router.post('/auth/register', validateBody(registerUserSchema), registerUser);
router.post('/auth/login', validateBody(loginSchema), loginUser);
router.post('/auth/refresh', refreshSchema,refreshSession);
router.post('/auth/logout', validateBody(logoutSchema), logoutUser);
export default router;
