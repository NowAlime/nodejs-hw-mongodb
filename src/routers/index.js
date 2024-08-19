import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import emailRouter from './emailRouter.js';
import uploadRouter from './uploadRouter.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/emailRouter', emailRouter);
router.use('/uploadRouter', uploadRouter);

export default router; 