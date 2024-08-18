import  Contact  from '../db/models/contact.js'
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContactsFromDB = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactByIdFromDB = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (req, res, next) => {
  try {
    const { name, phone, email, userId } = req.body;
    const photo = req.file ? await uploadImage(req.file.path) : null;

    const contact = new Contact({
      name,
      phone,
      email,
      userId,
      photo: photo ? photo.secure_url : null
    });

    await contact.save();

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};
export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phone, email, userId } = req.body;
    const photo = req.file ? await uploadImage(req.file.path) : null;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      {
        name,
        phone,
        email,
        photo: photo ? photo.secure_url : undefined
      },
      { new: true }
    );


    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact
    });
  } catch (error) {
    next(error);
  }
};