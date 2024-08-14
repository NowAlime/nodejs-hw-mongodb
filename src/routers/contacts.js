import express from 'express';
import { 
  getAllContactsController, 
  getContactByIdController, 
  patchContactByIdController, 
  postContactController, 
  deleteContactByIdController 
} from '../controllers/contacts.js';
import { registerUser } from '../controllers/auth.js'; 
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody, isValidId } from '../middlewares/validation.js';
import { createContactSchema, updateContactSchema } from '../validation/contactValidation.js';
import { registerUserSchema } from '../schemas/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/auth/register', validateBody(registerUserSchema), registerUser);

router.use(authenticate);

router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(postContactController));
router.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactByIdController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactByIdController));

export default router;
