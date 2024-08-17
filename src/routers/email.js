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

import { upload } from '../middlewares/multerConfig.js';

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
  upload.single('photo'),
  ctrlWrapper(createContactController),
);
router.use(authenticate);
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
  upload.single('photo'),
  ctrlWrapper(patchContactByIdController),
);

export default router;
