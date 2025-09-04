import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Visit", visitSchema);
