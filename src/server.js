import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { getAllContacts, getContactsId } from './services/contacts.js';

dotenv.config();
const PORT = Number(process.env.PORT);

export const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use((req, res, next) => {
        console.log(`Time: ${new Date().toLocaleString()}`);
        next();
    });
    app.use((err, req, res, next) => {
        res.status(404).json({
            message: 'Not found'
        });
        next();
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            data: contacts,
        });
    });
    app.get('/contacts/:contactsId', async (req, res) => {
        try {
            const { contactsId } = req.params;
            const contacts = await getContactsId(contactsId);
        
            if (!contacts) {
                res.status(404).json({
                    message: 'Contact not found',
                });
                return;
            }
            res.status(200).json({
                status: 200,
                message: `Successfully found contact with id ${contactsId}!`,
                data: contacts,
            });
        } catch (error) {
            console.error("Error", error);
            res.status(404).json({
                message: 'Server error',
            });
        }
      
        
    });
};

