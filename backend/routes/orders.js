import express from "express";
import Order from "../models/order.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

// ✅ Create new order (customer checkout)
router.post("/", async (req, res) => {
  try {
    const { customerName, address, city, postalCode, phoneNumber, items, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "Order must have items" });
    }

    const order = new Order({
      customerName,
      address,
      city,
      postalCode,
      phoneNumber,
      items,
      totalPrice,
      status: "Pending"
    });

    await order.save();
    res.status(201).json({ msg: "Order placed successfully!", orderId: order._id });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ msg: "Error creating order" });
  }
});

// ✅ Admin: Get all orders
router.get("/orders", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ msg: "Error fetching orders" });
  }
});

export default router;
