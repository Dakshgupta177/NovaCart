import mongoose from "mongoose";

const suggestion = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});

const computedAiSuggestionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    suggestions: [suggestion],
  },
  {
    timestamps: true,
  },
);

export const ComputedAiSuggestions = mongoose.model(
  "ComputedAiSuggestions",
  computedAiSuggestionsSchema,
);
