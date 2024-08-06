import { 
  getAllContacts as getAllContactsService, 
  getContactById as getContactByIdService, 
  updateContactById as updateContactByIdService, 
  createContact as createContactService, 
  deleteContact as deleteContactService 
} from '../services/contacts.js';
import createHttpError from 'http-errors';

import Contact from '../db/models/contact.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.json({ status: 'success', data: contacts });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 'success', data: contact });
  } catch (error) {
    next(error);
  }
};

export const postContactController = async (req, res, next) => {
  try {
    const newContact = await Contact.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json({
      status: 'success',
      message: 'Contact successfully created',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactByIdController = async (req, res, next) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: req.params.contactId, userId: req.user._id });
    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const patchContactByIdController = async (req, res, next) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 'success', data: updatedContact });
  } catch (error) {
    next(error);
  }
};
