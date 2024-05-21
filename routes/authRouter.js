import express from "express";
import usersController from "../controllers/usersContollers.js";

import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import {
  userSignupSchema,
  subscripsionSchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const usersRouter = express.Router();

usersRouter.patch(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(subscripsionSchema),
  usersController.updateSubscription
);

usersRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  usersController.signup
);

usersRouter.post(
  "/login",
  validateBody(userSignupSchema),
  usersController.login
);

usersRouter.get("/current", authenticate, usersController.getCurrent);

usersRouter.post("/logout", authenticate, usersController.signout);

export default usersRouter;
