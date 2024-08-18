import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { emailSchema } from '../validation/email.js';
import { sendResetEmailController } from '../controllers/email.js';

const emailRouter = express.Router();

emailRouter.post('/send-reset-email', validateBody(emailSchema), sendResetEmailController);

export default emailRouter;
