import express from 'express';
import  ctrlWrapper  from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactByIdController,
  patchContactByIdController
} from '../controllers/contacts.js';
import upload from '../middlewares/upload.js';


const router = express.Router();
const parseJSON = express.json({
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb',
});

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '',
  parseJSON,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIdController),
);

router.patch(
  '/:contactId',
  parseJSON,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

router.post('/contacts', upload.single('photo'), createContactController);

router.patch('/contacts/:contactId', upload.single('photo'), updateContactController);

export default router;