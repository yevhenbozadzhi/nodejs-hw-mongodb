import createHttpError from "http-errors";
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path'; 
import { SWAGGER_PATH } from "../constants/index.js";


export const swaggerDocs = () => {
  try {
    const swaggerFilePath = path.resolve(SWAGGER_PATH);
    const swaggerDoc = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));
    return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.error('Failed to load Swagger:', err);
    return [(req, res, next) => next(createHttpError(500, 'Cannot load Swagger docs'))];
  }
};
