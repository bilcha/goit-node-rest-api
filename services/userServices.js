import User from "../models/User.js";

export const registerUser = (data) => User.create(data);

export const findUser = (filter) => User.findOne(filter);
