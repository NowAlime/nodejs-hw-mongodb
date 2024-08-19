import { uploadImage } from '../utils/cloudinary.js';
import Contact from '../db/models/contact.js';

export const createContact = async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;
  
      let photoUrl = '';
      if (req.file) {
        photoUrl = await uploadImage(req.file.path);
      }
  
      const newContact = new Contact({
        name,
        email,
        phone,
        photo: photoUrl,
      });
  
      await newContact.save();
  
      res.status(201).json({
        status: 201,
        message: 'Contact created successfully!',
        data: newContact,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export const updateContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const { name, email, phone } = req.body;
  
      let photoUrl = '';
      if (req.file) {
        photoUrl = await uploadImage(req.file.path);
      }
  
      const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        {
          name,
          email,
          phone,
          photo: photoUrl,
        },
        { new: true }
      );
  
      if (!updatedContact) {
        return res.status(404).json({
          status: 404,
          message: 'Contact not found!',
        });
      }
  
      res.status(200).json({
        status: 200,
        message: 'Contact updated successfully!',
        data: updatedContact,
      });
    } catch (error) {
      next(error);
    }
  };