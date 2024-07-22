import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();


const PORT = process.env.PORT || 3008;


const setupServer = async () => {
  try {
   
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({ transport: { target: 'pino-pretty' } }));

    app.get('/contacts', async (req, res) => {
      try {
        const contacts = await getAllContacts();
        res.json({
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        });
      } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
      }
    });

    app.get('/contacts/:contactId', async (req, res) => {
      const { contactId } = req.params;
      try {
        const contact = await getContactById(contactId);
        if (!contact) {
          return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        });
      } catch (error) {
        console.error(`Error fetching contact with id ${contactId}:`, error);
        res.status(500).json({ message: 'Failed to fetch contact' });
      }
    });

   
    app.use((req, res, next) => {
      console.log(`Time: ${new Date().toLocaleString()}`);
      next();
    });

    app.use('*', (req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      res.status(500).json({ message: 'Something went wrong!', error: error.message });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing server:', error);
  }
};

export default setupServer;
