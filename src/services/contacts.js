import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
    
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
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            includeResult: true,
            ...options,
        },
    );
    if (!rawResult || !rawResult.value) return null;
    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upsert),
    };
};


export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findByIdAndDelete({ _id: contactId });
    return contact;
}