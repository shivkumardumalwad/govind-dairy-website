const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Place order
router.post("/", async (req, res) => {
  try {
    const { user, items, total } = req.body;
    const order = new Order({ user, items, total });
    await order.save();
    res.json({ msg: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ msg: "Error placing order" });
  }
});

// Get user orders
router.get("/:userId", async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).populate("items.product");
  res.json(orders);
});

module.exports = router;
