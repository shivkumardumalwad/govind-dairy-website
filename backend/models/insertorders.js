import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Order from "./order.js"; // correct relative path

// Load .env from parent folder
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is undefined in .env");
  process.exit(1);
}

const orders = [
  {
    customerName: "John Doe",
    address: "123 Street",
    city: "Mumbai",
    postalCode: "400001",
    phoneNumber: "9876543210",
    items: [
      { product: "Milk", quantity: 2, price: 50 },
      { product: "Butter", quantity: 1, price: 40 }
    ],
    totalPrice: 140,
    status: "Pending",
    createdAt: new Date()
  },
  {
    customerName: "Jane Smith",
    address: "456 Road",
    city: "Thane",
    postalCode: "400606",
    phoneNumber: "9876543211",
    items: [
      { product: "Cheese", quantity: 1, price: 100 },
      { product: "Milk", quantity: 1, price: 50 }
    ],
    totalPrice: 150,
    status: "Pending",
    createdAt: new Date()
  }
];

const insertOrders = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");

    await Order.insertMany(orders);
    console.log("✅ Sample orders added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting orders:", err);
    process.exit(1);
  }
};

insertOrders();
