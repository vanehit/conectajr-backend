import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    passwordHash: {
      type: String,
      required: false, 
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, 
    },

    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
