import * as contactServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const filter = { owner };
    const fields = "-createdAt -updatedAt";
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const settings = { skip, limit };
    const result = await contactServices.listContacts({
      filter,
      fields,
      settings,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const result = await contactServices.getContactByFilter({ _id, owner });
    if (!result) {
      throw HttpError(404, `Contact not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const result = await contactServices.removeContact({ _id, owner });
    if (!result) {
      throw HttpError(404, `Contact not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactServices.addContact({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactServices.updateContactByFilter(
      { _id, owner },
      req.body
    );
    if (!result) {
      throw HttpError(404, `Contact not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
const updateContactFavorite = async (req, res, next) => {
  try {
    const { error } = updateContactFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const result = await contactServices.updateStatusContact({
      ...req.body,
      owner,
      _id,
    });
    if (!result) {
      throw HttpError(404, `Contact not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavorite,
};
