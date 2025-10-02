import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactsId, updateContact } from "../services/contacts.js"
import { parsePaginationParams } from "../utilits/parsePaginationParams.js";
import { parseSortParams } from "../utilits/parseSortParams.js";

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const userId = req.user._id;
    const contacts = await getAllContacts({
       userId, page, perPage, sortBy, sortOrder,
    });
    res.json({
        status: 200,
        message: 'Success',
        data: contacts,
    });

}

export const getContactsIdController = async (req, res) => {
    
    const { contactId } = req.params;
    const contact = await getContactsId(contactId);
               if (!contact) {
                   throw createHttpError(404, 'Contact not found');
               }
               res.status(200).json({
                   status: 200,
                   message: `Successfully found contact with id ${contactId}!`,
                   data: contact,
               });       
}

export const createContactController = async (req, res) => {
    const body = req.body;
    const contact = await createContact(body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });


}

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body,{
        upsert: false,
        new: true,
    });
    if (!contact) {
        throw(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
        status:200,
        message: 'Successfully patched a contact!',
        data: contact,
    });
}

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);
    if (!contact) {
        next(createHttpError(404, 'Contact not found')); 
        return;
    }
    res.status(204).end();

}