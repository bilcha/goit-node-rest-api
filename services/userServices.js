import User from "../models/User.js";
import bcript from "bcrypt";

export const findUser = (filter) => User.findOne(filter);

export const registerUser = async (data) => {
  const hashPassword = await bcript.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateSubscr = (filter, data) =>
  User.findOneAndUpdate(filter, data);
