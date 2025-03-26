import { Request, Response } from "express";
import User, { IUser } from "../model/user";
import { encrypt } from "../helper/password-bcrypts";

const createUser = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const verifyEmailUser = await User.findOne({ email: data.email });

    if (verifyEmailUser) {
      return res.status(409).send({ ok: false, mensaje: "Email ya en uso" });
    }

    const encrypts = await encrypt(data.password);
    data.password = encrypts;

    const create: IUser = await new User({ ...data });
    await create.save();

    res.status(201).send({
      ok: true,
      user: create,
      mensaje: "usuario creado con éxito",
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      mensaje: "¡Ups! Algo salió mal",
      message: "Ups! Something went wrong",
    });
  }
};

export { createUser };
