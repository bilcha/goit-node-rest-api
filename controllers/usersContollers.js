import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import { userSignupSchema } from "../schemas/usersSchemas.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = userSignupSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const avatarURL = gravatar.url(email, { s: "250" }, true);

    const user = await userServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const verificationToken = nanoid();

    const result = await userServices.registerUser({
      ...req.body,
      avatarURL,
      verificationToken,
    });

    const msg = {
      to: email,
      from: "cinari2254@fresec.com",
      subject: "Verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    sendEmail(msg);
    res.status(201).json({
      user: {
        email: result.email,
        subscription: result.subscription,
        avatarURL: result.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await userServices.findUser({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }

    await userServices.updateUser(
      { _id: user._id },
      { verify: true, verificationToken: "" }
    );

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userServices.findUser({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const msg = {
      to: email,
      from: "cinari2254@fresec.com",
      subject: "Re-verify email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };
    sendEmail(msg);

    res.json({
      message: "Verification email sent",
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
    if (!user.verify) {
      throw HttpError(401, "Email not verified");
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
  res.status(204).send();
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
const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  try {
    if (!req.file) {
      throw HttpError(409, "Please attach at least one file");
    }
    const avatar = await Jimp.read(req.file.path);
    await avatar.cover(250, 250).writeAsync(req.file.path);

    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);

    const avatarURL = path.join("avatars", filename);
    await userServices.updateUser({ _id }, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  verify,
  resendVerify,
  login,
  getCurrent,
  signout,
  updateSubscription,
  updateAvatar,
};
