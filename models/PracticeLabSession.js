import mongoose from "mongoose";

const conceptStatSchema = new mongoose.Schema(
  {
    concept: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["strong", "needs-work"],
      required: true,
    },
  },
  { _id: false },
);

const answerSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true, trim: true },
    wasCorrect: { type: Boolean, required: true },
    sourceConcepts: { type: [String], default: [] },
  },
  { _id: false },
);

const practiceLabSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stack: {
      type: String,
      enum: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
      required: true,
    },
    earnedXp: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    answeredQuestions: { type: Number, required: true, min: 0 },
    correctAnswers: { type: Number, required: true, min: 0 },
    accuracyRate: { type: Number, required: true, min: 0, max: 100 },
    dominantConcepts: { type: [conceptStatSchema], default: [] },
    improvementConcepts: { type: [conceptStatSchema], default: [] },
    seniorityGap: { type: String, required: true, trim: true },
    nextRecommendedTopic: { type: String, required: true, trim: true },
    answers: { type: [answerSchema], default: [] },
    sessionSource: {
      type: String,
      default: "interview-simulator",
    },
  },
  { timestamps: true },
);

export default mongoose.model("PracticeLabSession", practiceLabSessionSchema);
