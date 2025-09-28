import express from "express";
import Order from "../models/orders.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Get all orders for admin
router.get("/orders", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ msg: "Server error fetching orders" });
  }
});

export default router;
