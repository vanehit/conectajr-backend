// models/Like.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true
    }
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, content: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);