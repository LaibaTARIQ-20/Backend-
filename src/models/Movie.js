import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    overview: { type: String },
    releaseYear: { type: Number },
    genres: [{ type: String }],
    runtime: { type: Number },
    posterUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);