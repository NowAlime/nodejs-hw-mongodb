import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const query = {};

  if (filters.type) {
    query.contactType = filters.type;
  }

  if (filters.isFavourite !== undefined) {
    query.isFavourite = filters.isFavourite === 'true';
  }

  try {
    const totalItems = await Contact.countDocuments(query);
    const contacts = await Contact.find(query).sort(sortOptions).skip(skip).limit(perPage);
    return { contacts, totalItems };
  } catch (error) {
    throw new Error('Error fetching contacts: ' + error.message);
  }
};

export const getContactById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw new Error('Error fetching contact by ID: ' + error.message);
  }
};

export const updateContactById = async (contactId, update) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, update, { new: true });
  } catch (error) {
    throw new Error('Error updating contact: ' + error.message);
  }
};

export const createContact = async (data) => {
  try {
    return await Contact.create(data);
  } catch (error) {
    throw new Error('Error creating contact: ' + error.message);
  }
};

export const deleteContact = async (id) => {
  try {
    return await Contact.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Error deleting contact: ' + error.message);
  }
};
