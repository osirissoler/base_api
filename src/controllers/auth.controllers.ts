import { Request, Response } from "express";
import User from "../model/user";
import bcrypt from "bcrypt";
import { generarJWT } from "../helper/create-jwt";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).send({
        ok: false,
        message: "Wrong email or password",
        mensaje: "Correo o contraseña equivocada",
        status: 404,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(404).json({
        ok: false,
        message: "Wrong email or password",
        mensaje: "Correo o contraseña equivocada",
        status: 404,
      });
    }

    if (user.isDeleted) {
      return res.status(404).send({
        ok: false,
        message: "This user was isDeleted contact an administrator",
        mensaje: "Usuario Eliminado, contacte un administrador",
      });
    }

    if (!user.isActived) {
      return res.status(404).send({
        ok: false,
        message: "User disabled, contact an administrator",
        mensaje: "Usuario desactivado, contacte un administrador",
      });
    }

    const userToSend = user.toObject(); // Convertir a objeto para evitar problemas con métodos de Mongoose
    delete userToSend.password;
    const token = await generarJWT(userToSend);

    res.status(200).send({
      ok: true,
      message: "Welcome",
      user: userToSend,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
      error,
    });
  }
};

export { login };
