import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { emailSchema, resetPwdSchema } from '../validation/email.js';
import { sendResetEmailController, resetPasswordController } from '../controllers/email.js';

const emailRouter = express.Router();

emailRouter.post('/send-reset-email', validateBody(emailSchema), sendResetEmailController);
emailRouter.post('/reset-pwd', validateBody(resetPwdSchema), resetPasswordController);

export default emailRouter;
