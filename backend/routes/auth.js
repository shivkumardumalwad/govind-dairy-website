const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET = "govinddairy_secret"; // ⚠️ use .env in production

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.json({ msg: "User already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.json({ msg: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ msg: "Error registering user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json({ msg: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Invalid password!" });

    // create token
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: "2h" });

    res.json({ msg: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ msg: "Error logging in" });
  }
});

// Example protected route
router.get("/profile", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ msg: "Profile data", user: decoded });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

module.exports = router;
