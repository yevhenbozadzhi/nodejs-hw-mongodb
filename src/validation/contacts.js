import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const createContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').required(),
    userId: Joi.string().required().custom((value, helper) => {
        if (value && !isValidObjectId(value)) {
            return helper.message('Parent id should be a valid mongo id');
        }
        return true;
    }),
});

export const createContactsPatchSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
     userId: Joi.string().custom((value, helper) => {
        if (value && !isValidObjectId(value)) {
            return helper.message('Parent id should be a valid mongo id');
        }
        return true;
    }),
});