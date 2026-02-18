export const validateCreateMovie = (req, res, next) => {
  const { title, releaseYear, genres, runtime, posterUrl } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Movie title is required" });
  }

  if (releaseYear) {
    const year = Number(releaseYear);
    if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 10) {
      return res
        .status(400)
        .json({ error: "Release year must be a valid year" });
    }
  }

  if (genres && !Array.isArray(genres)) {
    return res.status(400).json({ error: "Genres must be an array" });
  }

  if (runtime) {
    const runtimeNum = Number(runtime);
    if (isNaN(runtimeNum) || runtimeNum <= 0) {
      return res
        .status(400)
        .json({ error: "Runtime must be a positive number" });
    }
  }

  if (posterUrl && posterUrl.trim() !== "") {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(posterUrl)) {
      return res.status(400).json({ error: "Poster URL must be a valid URL" });
    }
  }

  next();
};

export const validateUpdateMovie = (req, res, next) => {
  const { title, releaseYear, genres, runtime, posterUrl } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (releaseYear !== undefined) {
    const year = Number(releaseYear);
    if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 10) {
      return res
        .status(400)
        .json({ error: "Release year must be a valid year" });
    }
  }

  if (genres !== undefined && !Array.isArray(genres)) {
    return res.status(400).json({ error: "Genres must be an array" });
  }

  if (runtime !== undefined) {
    const runtimeNum = Number(runtime);
    if (isNaN(runtimeNum) || runtimeNum <= 0) {
      return res
        .status(400)
        .json({ error: "Runtime must be a positive number" });
    }
  }

  if (posterUrl !== undefined && posterUrl.trim() !== "") {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(posterUrl)) {
      return res.status(400).json({ error: "Poster URL must be a valid URL" });
    }
  }

  next();
};
