import { ContactsCollection, validateContact } from '../validation/contacts.js';
import { SORT_ORDER } from '../constants/index.js';
import calculatePagination from '../utils/calculatePagination.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;


  const countQuery = ContactsCollection.countDocuments({
    userId,
    ...filter,
  });

  
  const contactsQuery = ContactsCollection.find({
    userId,
    ...filter,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

 
  const [contactsCount, contacts] = await Promise.all([
    countQuery,
    contactsQuery.exec(),
  ]);

 
  const paginationData = calculatePagination(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};


export const getContactById = async (contactId, userId) => {
  try {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    return contact;
  } catch (error) {
    console.error("Error fetching contact by ID:", error);
    throw new Error("Failed to fetch contact");
  }
};

export const deleteContact = async (contactId, userId) => {
  try {
    const contact = await ContactsCollection.findOneAndDelete({
      _id: contactId,
      userId,
    });
    return contact;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw new Error("Failed to delete contact");
  }
};

export const updateContact = async (contactId, payload, userId, options = {}) => {
  try {
    const rawResult = await ContactsCollection.findByIdAndUpdate(
      { _id: contactId, userId },
      payload,
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
      contact: rawResult.value,
      isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
  } catch (error) {
    console.error("Error updating contact:", error);
    throw new Error("Failed to update contact");
  }
};

export const createContact = async (payload) => {
  try {
    const { error } = validateContact.validate(payload);
    if (error) {
      throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
    }

    const contact = new ContactsCollection({
      ...payload,
      userId: payload.userId,
    });

    await contact.save();
    return contact;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw new Error("Failed to create contact");
  }
};
