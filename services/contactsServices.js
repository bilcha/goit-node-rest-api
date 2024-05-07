import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();

export const getContactById = async (contactId) => {};

export const removeContact = async (contactId) => {};

export const addContact = async (data) => {};

export const updateContactById = async (id, data) => {};
