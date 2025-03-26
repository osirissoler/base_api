import * as user from "../controllers/user.controllers";
const { check } = require("express-validator");
import express = require("express");
import { validarUserEmail } from "../middlewares/validate-email";
import { validarFields } from "../middlewares/validate-fields";

const userRouter: express.Router = express.Router();

userRouter.post(
  "/createUser",
  [
    check("name", "the name is required").not().isEmpty(),
    check("email", "the email is required").not().isEmpty(),
    check("password", "The password must have at least 6 characters, one uppercase letter, and one number.")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .matches(/^(?=.*[A-Z])(?=.*\d).*$/),
    check("email").custom(validarUserEmail),
    validarFields,
  ],
  user.createUser
);

export default userRouter;
