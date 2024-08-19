import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import emailRouter from './emailRouter.js';
import uploadRouter from './uploadRouter.js';

const router = Router();

contactsRouter.use('/contacts', contactsRouter);
authRouter.use('/auth', authRouter);
emailRouter.use('/emailRouter', emailRouter);
uploadRouter.use('/uploadRouter', uploadRouter);

export default router; 