import express from "express";
import usersController from "../controllers/usersContollers.js";

import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../middlewares/IsValidId.js";
import { userSignupSchema } from "../schemas/usersSchemas.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  usersController.signup
);

// usersRouter.post( "/login", usersController.getOneContact);

// usersRouter.post("/logout", usersController.deleteContact);

// usersRouter.get("/current", usersController.getOneUser);

export default usersRouter;
