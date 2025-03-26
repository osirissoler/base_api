import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../model/user";

const validarUserEmail = async (email = "") => {
  const validarCorreo = await User.findOne({ email });

  if (validarCorreo) {
    throw new Error(
      `Ha habido un problema al crear tu cuenta. Comprueba que tu dirección de correo electrónico está escrita correctamente.`
    );
  }
};


export { validarUserEmail };
