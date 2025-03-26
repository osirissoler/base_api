import * as rol from "../controllers/rol.controllers";

const { check } = require("express-validator");
import express = require("express");
import { validarFields } from "../middlewares/validate-fields";



const rolRouter: express.Router = express.Router();

rolRouter.post(
  "/createRol",
  [
    check("name", "the name is required").not().isEmpty(),
    check("code", "the code is required").not().isEmpty(),
    validarFields,
  ],
  rol.createRol
);

export default rolRouter;
