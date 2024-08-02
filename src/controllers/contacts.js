import { 
  getAllContacts as getAllContactsService, 
  getContactById as getContactByIdService, 
  updateContactById as updateContactByIdService, 
  createContact as createContactService, 
  deleteContact as deleteContactService 
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    const type = req.query.type;
    const isFavourite = req.query.isFavourite === 'true';

    const filters = {};
    if (type) filters.type = type;
    if (isFavourite !== undefined) filters.isFavourite = isFavourite;

    const { contacts, totalItems } = await getAllContactsService(page, perPage, sortBy, sortOrder, filters);
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
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

export const postContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite = false, contactType } = req.body;
    if (!name || !phoneNumber || !contactType) {
      return next(createHttpError(400, 'Name, phone number, and contact type are required'));
    }
    const contact = await createContactService({ name, phoneNumber, email, isFavourite, contactType });
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
    const contact = await deleteContactService(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
    res.status(204).send();  
  } catch (error) {
    next(error);
  }
};

export const patchContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const update = req.body;

    const updatedContact = await updateContactByIdService(contactId, update);

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};
