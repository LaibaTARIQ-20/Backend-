import express from "express";
import {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validateAddToWatchlist,
  validateUpdateWatchlist,
} from "../validators/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateAddToWatchlist, addToWatchlist);
router.put("/:id", validateUpdateWatchlist, updateWatchlistItem);
router.delete("/:id", removeFromWatchlist);

export default router;
