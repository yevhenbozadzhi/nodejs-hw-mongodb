import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUI from 'swagger-ui-express';

dotenv.config();
const PORT = Number(process.env.PORT);

const swaggerFilePath = path.resolve('./docs/swagger-bundle.json');
let swaggerDocument;
try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));
  console.log('Swagger documentation loaded successfully');
} catch (err) {
  console.error('Failed to load Swagger documentation:', err);
  swaggerDocument = null;
}

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
  });
  app.use(router);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

