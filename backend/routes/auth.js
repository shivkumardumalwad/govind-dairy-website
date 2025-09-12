import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const SECRET = "govinddairy_secret"; // ⚠️ Move to .env in production

// 🔐 Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.json({ msg: "User already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.json({ msg: "Registration successful!", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Error registering user" });
  }
});

// 🔓 Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json({ msg: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Invalid password!" });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
      expiresIn: "2h",
    });

    res.json({ msg: "Login successful!", token });
  } catch (err) {
    res.status(500).json({ msg: "Error logging in" });
  }
});

// 👤 Profile
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

export default router;
