import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utilits/calculeatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find();
    const contactsCount = await ContactsCollection.find()
        .merge(contactsQuery)
        .countDocuments();
    
    const contacts = await contactsQuery.skip(skip).limit(limit).sort({[sortBy]: sortOrder}).exec();
    const paginationData = calculatePaginationData(contactsCount, perPage, page);
    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactsId = async (id) => {
    const contacts = await ContactsCollection.findById(id);
    return contacts;
}

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
        
}

export const updateContact = async (contactId, payload, options = {}) => {
    const contact = await ContactsCollection.findByIdAndUpdate(
        contactId,
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


export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findByIdAndDelete(contactId);
    return contact;
}