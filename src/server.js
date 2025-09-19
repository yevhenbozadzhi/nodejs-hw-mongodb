import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';


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
    app.use('/contacts', contactsRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
};

