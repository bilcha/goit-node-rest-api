import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import { userSignupSchema } from "../schemas/usersSchemas.js";

const signup = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = userSignupSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Помилка від Joi або іншої бібліотеки валідації");
    }
    const user = await userServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const result = await userServices.registerUser(req.body);
    res.status(201).json({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userServices.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  getOneUser,
};
