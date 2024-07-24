import express from 'express';
import {getAllContactsController, getContactByIdController, patchContactByIdController, postContactController, deleteContactByIdController,} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(postContactController));
router.patch('/contacts/:contactId', ctrlWrapper(patchContactByIdController));  
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactByIdController));

export default router;
