import "dotenv/config";
import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());
connectDB();

app.use("/movies", movieRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
