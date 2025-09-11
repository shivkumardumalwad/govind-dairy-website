const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Admin view all orders
router.get("/orders", async (req, res) => {
  const orders = await Order.find().populate("user items.product");
  res.json(orders);
});

module.exports = router;
