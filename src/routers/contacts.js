import express from 'express';
import { 
  getAllContactsController, 
  getContactByIdController, 
  patchContactByIdController, 
  postContactController, 
  deleteContactByIdController 
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody, isValidId } from '../middlewares/validation.js';
import { createContactSchema, updateContactSchema } from '../validation/contactValidation.js';
import { registerUserSchema } from '../validators/auth.js'

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(postContactController));
router.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactByIdController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactByIdController));
router.post('/auth/register', validateBody(registerUserSchema), registerUser);

export default router;
