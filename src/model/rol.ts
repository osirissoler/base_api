import mongoose, { Schema, model, Types } from "mongoose";
import moment from "moment";

export interface IRol extends  mongoose.Document {
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const RolSchema = new Schema<IRol>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      code: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya códigos repetidos
        uppercase: true, // Convierte a mayúsculas automáticamente
        trim: true,
      },
    },
    {
      timestamps: true, // Agrega `createdAt` y `updatedAt` automáticamente
      versionKey: false, // Evita el campo `__v`
    }
  );

  export default model<IRol>("Rol", RolSchema);
