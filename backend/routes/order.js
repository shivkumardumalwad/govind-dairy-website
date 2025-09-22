import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

// POST /api/orders - place an order
router.post('/', async (req, res) => {
  try {
    const { customerName, address, city, postalCode, phoneNumber, items, totalPrice } = req.body;

    if (!customerName || !address || !city || !postalCode || !phoneNumber || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const order = new Order({
      customerName,
      address,
      city,
      postalCode,
      phoneNumber,
      items,
      totalPrice,
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) GET /api/orders - get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
