import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js'; // Make sure this file exists
import orderRoutes from './routes/orders.js';

// ...



const app = express();

// Middleware to enable CORS and parse JSON body requests
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using your db.js config
connectDB();

// Mount auth routes at /api (login, register, profile)
app.use('/api', authRoutes);

// Mount product routes at /api/products (admin functionality)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// Simple root endpoint for quick API check
app.get('/', (req, res) => {
  res.send('🥛 Govind Dairy API is running...');
});

// Start server on specified port or 5000 by default
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
