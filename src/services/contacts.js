import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utilits/calculeatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    userId,
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find({userId});
    const contactsCount = await ContactsCollection.find({userId})
        .merge(contactsQuery)
        .countDocuments();
    
    const contacts = await contactsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();
    const paginationData = calculatePaginationData(contactsCount, perPage, page);
    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactsId = async (userId, id) => {
    const contacts = await ContactsCollection.findOne({userId, _id: id});
    return contacts;
}

export const createContact = async (userId, payload) => {
    const contact = await ContactsCollection.create({...payload,userId});
    return contact;
        
}

export const updateContact = async (userId, contactId, payload, options = {}) => {
    const contact = await ContactsCollection.findOneAndUpdate({  _id: contactId,
        userId,},
        payload,
        {
            new: true,
            includeResult: true,
            ...options,
        },
       
    ); return contact;
    // if (!rawResult || !rawResult.value) return null;
    // return {
    //     contact: rawResult.value,
    //     isNew: Boolean(rawResult?.lastErrorObject?.upsert),
    // };
};


export const deleteContact = async (userId, contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({userId, _id: contactId});
    return contact;
}