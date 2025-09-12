import mongoose from 'mongoose';  // Using import instead of require

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  image: String,
  stock: { type: Number, default: 100 },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;  // Exporting the model as default