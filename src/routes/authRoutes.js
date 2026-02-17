import express from "express";

const Router = express.Router();

router.get("/login", (req, res) => {
  res.json({ message: "Login route" });
});

router.post("/register", (req, res) => {
  res.json({ message: "Register route" });
});

export default Router;
