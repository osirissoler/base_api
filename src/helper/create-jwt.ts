import * as jwt from "jsonwebtoken";

const generarJWT = (data) => {
  return new Promise((resolve, reject) => {
    const payload = { data };
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "8760h", // 365 días en horas
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export { generarJWT };
