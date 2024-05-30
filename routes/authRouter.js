import express from "express";
import usersController from "../controllers/usersContollers.js";
import upload from "../middlewares/upload.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../helpers/validateBody.js";
import {
  userSignupSchema,
  subscripsionSchema,
  emailSchema,
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

usersRouter.get("/verify/:verificationToken", usersController.verify);
usersRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(emailSchema),
  usersController.resendVerify
);

usersRouter.post(
  "/login",
  validateBody(userSignupSchema),
  usersController.login
);

usersRouter.get("/current", authenticate, usersController.getCurrent);

usersRouter.post("/logout", authenticate, usersController.signout);

usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  usersController.updateAvatar
);

export default usersRouter;
