import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import { userSignupSchema } from "../schemas/usersSchemas.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

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

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userServices.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const comparePassword = await compareHash(password, user.password);
    if (!comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    }
    const { _id: id } = user;

    const payload = {
      id,
    };
    const token = createToken(payload);
    await userServices.updateUser({ _id: id }, { token });

    res.json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res) => {
  const { subscription, email } = req.user;
  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await userServices.updateUser({ _id }, { token: "" });
  res.json({
    message: "Signout successfully",
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    await userServices.updateSubscr({ _id }, { subscription });
    res.json({
      message: `Subscription updated successfully`,
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  login,
  getCurrent,
  signout,
  updateSubscription,
};
