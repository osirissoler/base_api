import * as auth from "../controllers/auth.controllers";

const { check } = require("express-validator");
import express = require("express");
import { validarFields } from "../middlewares/validate-fields";

const authRouter: express.Router = express.Router();

authRouter.post(
  "/login",
  [
    check("email", "the email is required").not().isEmpty(),
    check("password", "the code is required").not().isEmpty(),
    validarFields,
  ],
  auth.login
);

export default authRouter;
