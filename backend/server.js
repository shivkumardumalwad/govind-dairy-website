const express = require("express");
const mongoose = require("mongoose");
const connectDB = require('./config/db');

const cors = require("cors");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/govindDairy")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/products", require("./routes/product")); // uses the router above

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
