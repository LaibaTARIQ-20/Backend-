import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    status: {
      type: String,
      enum: ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"],
      default: "PLANNED",
    },
    rating: { type: Number, min: 1, max: 10 },
    notes: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("WatchlistItem", watchlistSchema);
