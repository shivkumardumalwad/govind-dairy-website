const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching products" });
  }
});

// Add product (admin)
router.post("/", async (req, res) => {
  try {
    const { name, price, category, description, image, stock } = req.body;
    if (!name || price == null || !category) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const product = new Product({ name, price, category, description, image, stock });
    await product.save();

    res.status(201).json({ msg: "Product added", product });
  } catch (err) {
    res.status(500).json({ msg: "Error adding product" });
  }
});

// Delete product (admin)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting product" });
  }
});

// Update product (optional admin feature)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ msg: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating product" });
  }
});

module.exports = router;
