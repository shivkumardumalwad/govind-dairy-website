import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String }
    items: [itemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
