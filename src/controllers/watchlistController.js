import WatchlistItem from "../models/WatchlistItem.js";

const addToWatchlist = async (req, res) => {
  try {
    const { movieId, status, rating, notes } = req.body;

    // Check if movie already in user's watchlist
    const existingItem = await WatchlistItem.findOne({
      userId: req.user._id,
      movieId: movieId,
    });

    if (existingItem) {
      return res.status(400).json({ error: "Movie already in your watchlist" });
    }

    const watchlistItem = await WatchlistItem.create({
      userId: req.user._id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    });

    const populatedItem = await WatchlistItem.findById(watchlistItem._id)
      .populate("movieId")
      .populate("userId", "name email");

    res.status(201).json({
      status: "success",
      data: { watchlistItem: populatedItem },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWatchlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    const watchlistItem = await WatchlistItem.findById(id);

    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Check if user owns this watchlist item
    if (watchlistItem.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update your own watchlist" });
    }

    const updatedItem = await WatchlistItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("movieId")
      .populate("userId", "name email");

    res.status(200).json({
      status: "success",
      data: { watchlistItem: updatedItem },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;

    const watchlistItem = await WatchlistItem.findById(id);

    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Check if user owns this watchlist item
    if (watchlistItem.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own watchlist items" });
    }

    await WatchlistItem.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Removed from watchlist successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { addToWatchlist, updateWatchlistItem, removeFromWatchlist };
