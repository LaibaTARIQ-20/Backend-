import Movie from "../models/Movie.js";

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate("createdBy", "name email");
    res.status(200).json({
      status: "success",
      results: movies.length,
      data: { movies },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } =
      req.body;

    const movie = await Movie.create({
      title,
      overview,
      releaseYear,
      genres,
      runtime,
      posterUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if user owns this movie
    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update your own movies" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { movie: updatedMovie },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if user owns this movie
    if (movie.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own movies" });
    }

    await Movie.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllMovies, createMovie, updateMovie, deleteMovie };
