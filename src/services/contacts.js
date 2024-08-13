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

  const totalItems = await Contact.countDocuments(query);
  const contacts = await Contact.find(query).sort(sortOptions).skip(skip).limit(perPage);
  return { contacts, totalItems };
};

export const getContactById = async (id) => {
  return Contact.findById(id);
};

export const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};

export const updateContactById = async (contactId, update) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, update, { new: true });
  return updatedContact;
};
export const createContact = async (data) => {
  return Contact.create(data);
};

export const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};