import createHttpError from 'http-errors';
import {
  getAllContactsFromDB,
  getContactByIdFromDB,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getAllContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  const contacts = await getAllContactsFromDB({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });
  res.json({
    status: 200,
    message: 'Successfully fond contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactByIdFromDB(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const contactData = { ...req.body, userId: req.user._id };
  const contact = await createContact(contactData);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
}

export async function deleteContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.sendStatus(204);
}

export const patchContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await updateContact(contactId, {
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
