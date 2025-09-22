import express from "express";
import Product from "../models/product.js";
import { authenticateToken, authorizeAdmin } from "../middlewares/authmiddleware.js";

const router = express.Router();

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ msg: "Server error while fetching products." });
  }
});

// POST new product (admin only)
router.post("/", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, price, category, description, image, stock } = req.body;
    const product = new Product({ name, price, category, description, image, stock });
    await product.save();
    res.status(201).json({ msg: "Product added!", product });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ msg: "Server error while adding product." });
  }
});

// PUT update product by ID (admin only)
router.put("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product updated", product: updated });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ msg: "Server error while updating product." });
  }
});

// DELETE product by ID (admin only)
router.delete("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Product not found" });
    res.json({ msg: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ msg: "Server error while deleting product." });
  }
});

// GET product by ID (for editing)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ msg: "Server error while fetching product." });
  }
});

export default router;

