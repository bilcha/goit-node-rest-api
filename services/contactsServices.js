import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();

export const getContactById = (contactId) =>
  Contact.findOne({ _id: contactId });

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete({ _id: contactId });

export const addContact = (data) => Contact.create(data);

export const updateContactById = (contactId, data) =>
  Contact.findByIdAndUpdate({ _id: contactId }, data);

export const updateStatusContact = (contactId, favorite) =>
  Contact.findByIdAndUpdate({ _id: contactId }, favorite);
