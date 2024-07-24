import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

export const getAllContacts = async () => {
  return Contact.find({});
};

export const getContactById = async (id) => {
  return Contact.findById(id);
};

export const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};

export const createContact = async (data) => {
  return Contact.create(data);
};

export const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
