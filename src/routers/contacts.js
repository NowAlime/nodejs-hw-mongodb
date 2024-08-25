import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import {validateBody} from '../middlewares/validateBody.js';
import { validateContact, validateUpdate } from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router= Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);


router.post(
  '',
  upload.single('photo'),
  validateBody(validateContact),
  ctrlWrapper(createContactController),
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

router.put(
  '/:contactId',
  isValidId,
  validateBody(validateContact),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(validateUpdate),
  ctrlWrapper(patchContactController),
);



export default router;
