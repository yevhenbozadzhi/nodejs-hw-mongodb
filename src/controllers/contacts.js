import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactsId, updateContact } from "../services/contacts.js"
import { parsePaginationParams } from "../utilits/parsePaginationParams.js";
import { parseSortParams } from "../utilits/parseSortParams.js";
import { saveFileToUploadDir } from "../utilits/saveFileToUploadDir.js";
import { getEnvVar } from "../utilits/getEnvVar.js";
import { saveFileToCloudinary } from "../utilits/saveFileToCloudinary.js";



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
     const userId = req.user._id;
    const { contactId } = req.params;
    const contact = await getContactsId(userId, contactId);
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
    const userId = req.user._id;
    const contact = await createContact(userId, body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;
      const photo = req.file;

    let photoUrl;
    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
    }
    const contact = await updateContact(userId, contactId, {
        ...req.body,
        photo: photoUrl,
    },{
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
     const userId = req.user._id;
    const contact = await deleteContact(userId, contactId);
    if (!contact) {
        next(createHttpError(404, 'Contact not found')); 
        return;
    }
    res.status(204).end();

}
