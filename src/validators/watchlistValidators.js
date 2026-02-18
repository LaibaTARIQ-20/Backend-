export const validateAddToWatchlist = (req, res, next) => {
  const { movieId, status, rating } = req.body;

  if (!movieId || movieId.trim() === "") {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  if (status) {
    const validStatuses = ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
      });
    }
  }

  if (rating !== undefined) {
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }
  }

  next();
};

export const validateUpdateWatchlist = (req, res, next) => {
  const { status, rating } = req.body;

  if (status !== undefined) {
    const validStatuses = ["PLANNED", "WATCHING", "COMPLETED", "DROPPED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
      });
    }
  }

  if (rating !== undefined) {
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
      return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }
  }

  next();
};
