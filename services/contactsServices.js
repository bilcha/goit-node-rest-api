import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {}, fields = "", settings = {} } = search;
  return Contact.find(filter, fields, settings);
};

export const getContactByFilter = (filter) => {
  return Contact.findOne(filter);
};

export const removeContact = (filter) => Contact.findByIdAndDelete(filter);

export const addContact = (data) => Contact.create(data);

export const updateContactByFilter = (filter, data) =>
  Contact.findByIdAndUpdate(filter, data);

export const updateStatusContact = (filter, favorite) =>
  Contact.findByIdAndUpdate(filter, favorite);
