import express from 'express';
import Product from '../models/Product.js';
import verifyToken from '../middleware/verifyToken.js';  // import the middleware

const router = express.Router();

// Public route: get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching products" });
  }
});

// Public route: get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching product" });
  }
});

// Protected route: add product (admin only)
router.post("/", verifyToken, async (req, res) => {
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

// Protected route: delete product (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
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

// Protected route: update product (admin only)
router.put("/:id", verifyToken, async (req, res) => {
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

export default router;
