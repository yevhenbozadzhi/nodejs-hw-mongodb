import createHttpError from "http-errors";
import mongoose from "mongoose";

export const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        const {contactId} = req.params[paramName];
         if (!mongoose.isValidObjectId(contactId)) {
                    return next(createHttpError(404, "Contact not found"));
        }
        next();
    }
}