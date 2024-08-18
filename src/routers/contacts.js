import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
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
  deleteContactByIdController,
  patchContactByIdController,
} from '../controllers/contacts.js';


const contactsRouter = express.Router();


const parseJSON = express.json({
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb',
});


contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '',
  parseJSON,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIdController),
);

contactsRouter.patch(
  '/:contactId',
  parseJSON,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

export default contactsRouter;
