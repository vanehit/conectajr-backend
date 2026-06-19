import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    variant: { type: String, required: true }
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "pdf", "doc"],
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    resources: [resourceSchema],

    tags: [tagSchema],

    track: {
      type: String,
      enum: ["fundamentos", "javascript", "typescript"],
      default: "fundamentos"
    },

    accessLevel: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free"
    },

    previewDuration: {
      type: Number,
      default: 0 // segundos visibles si está locked
    },

    order: {
      type: Number,
      default: 0
    },

    published: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Índices para performance
contentSchema.index({ accessLevel: 1 });
contentSchema.index({ track: 1 });
contentSchema.index({ published: 1 });
contentSchema.index({ order: 1 });

export default mongoose.model("Content", contentSchema);
