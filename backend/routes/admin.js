import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/order.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "govinddairy_secret";

router.get("/orders", async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;

    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, SECRET);

    if (decoded.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized role" });

    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.json({ orders }); // Send as object with orders array
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ msg: "Error fetching orders" });
  }
});

export default router;
