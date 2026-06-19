import mongoose from "mongoose";

const practiceLabStatsSchema = new mongoose.Schema(
  {
    totalSessions: { type: Number, default: 0 },
    totalXp: { type: Number, default: 0 },
    strongestStacks: { type: [String], default: [] },
    focusConcepts: { type: [String], default: [] },
    lastPracticeAt: { type: Date, default: null },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    tier: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free",
    },
    premiumUntil: {
      type: Date,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "expired",
    },
    practiceLabStats: {
      type: practiceLabStatsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
