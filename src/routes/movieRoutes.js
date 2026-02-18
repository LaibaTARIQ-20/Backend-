import express from "express";
import {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validateCreateMovie,
  validateUpdateMovie,
} from "../validators/movieValidators.js";

const router = express.Router();

router.get("/", getAllMovies);
router.post("/", authMiddleware, validateCreateMovie, createMovie);
router.put("/:id", authMiddleware, validateUpdateMovie, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router;
