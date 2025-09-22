import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "govinddairy_secret";

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ msg: "Please provide username, password, and role" });
    }

    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ msg: "User already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role });
    await user.save();

    res.json({ msg: "Registration successful!", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error registering user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ msg: "Please provide username, password and role" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found!" });

    if (user.role !== role) {
      return res.status(403).json({ msg: "Unauthorized role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password!" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ msg: "Login successful!", token, success: true, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error logging in" });
  }
});

// Profile Route
router.get("/profile", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(actualToken, SECRET);
    res.json({ msg: "Profile data", user: decoded });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

export default router;
;
