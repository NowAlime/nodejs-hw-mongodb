import express from 'express';
import upload from '../middlewares/upload.js'; 
import { createContact, updateContact } from '../controllers/upload.js';  

const uploadRouter = express.Router();

uploadRouter.post('/contacts', upload.single('photo'), createContact);
uploadRouter.patch('/contacts/:contactId', upload.single('photo'), updateContact);

export default uploadRouter;