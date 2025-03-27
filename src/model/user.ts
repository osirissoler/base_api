import mongoose, { Schema, model, Types } from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  address: string;
  isActived: boolean;
  phone: string;
  password: string;
  img: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  location: string;
  isGoogle: boolean;
  isFacebook: boolean;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: false,
    },
    address: {
      type: String,
      require: true,
      default: "",
    },

    phone: {
      type: String,
      require: false,
      default: "",
    },
    password: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      require: false,
      default: "",
    },

    isActived: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
      default: "",
      require: false,
    },

    isGoogle: {
      type: Boolean,
      default: false,
    },
    isFacebook: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Agrega `createdAt` y `updatedAt` automáticamente
    versionKey: false, // Evita el campo `__v`
  }
);

export default model<IUser>("User", userSchema);
