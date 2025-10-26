import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();


app.use("/api/admin", adminRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
