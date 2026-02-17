export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  next();
};
