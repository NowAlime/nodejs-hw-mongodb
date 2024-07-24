import { getAllContacts, getContactById, updateContact, createContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const postContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    if (!name || !phoneNumber || !contactType) {
      return next(createHttpError(400, 'Name, phone number and contact type are required'));
    }
    const contact = await createContact({ name, phoneNumber, email, isFavourite, contactType });
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);
    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
    res.status(204).json();  
  } catch (error) {
    next(error);
  }
};
