import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, refreshSchema, logoutSchema } from '../schemas/auth.js'; 
import { loginUser, refreshSession, logoutUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/auth/login', validateBody(loginSchema), loginUser);
router.post('/auth/refresh', refreshSession);
router.post('/auth/logout', validateBody(logoutSchema), logoutUser); 

export default router;