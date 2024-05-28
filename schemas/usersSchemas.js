import Joi from "joi";
import { emailRegexp } from "../constatnts/user-constatnts.js";

export const userSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

export const subscripsionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});
