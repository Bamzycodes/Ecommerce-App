import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../model/orderModel.js';
import { isAuth, isAdmin } from '../utils.js';
import User from '../model/userModel.js';
import Product from '../model/productModel.js';

const orderRouter = express.Router();

// Get all orders (admin only)
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const orders = await Order.find().populate('user', 'name');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
  })
);

// Create new order
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
      
      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'Order items are required' });
      }

      const newOrder = new Order({
        orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user._id,
      });

      const order = await newOrder.save();
      res.status(201).json({ message: 'New Order Created', order });
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  })
);

// Get order summary (admin only)
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const [orders, users, products] = await Promise.all([
        Order.find(),
        User.find(),
        Product.find()
      ]);
      res.status(200).json({ users, orders, products });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching summary', error: error.message });
    }
  })
);

// Get user orders
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching your orders', error: error.message });
    }
  })
);

// Get order by ID
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order Not Found' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
  })
);

// Update order payment status
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order Not Found' });
      }

      if (order.isPaid) {
        return res.status(400).json({ message: 'Order is already paid' });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.status(200).json({ message: 'Order Paid', order: updatedOrder });
    } catch (error) {
      res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
  })
);

// Update order delivery status
orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order Not Found' });
      }

      if (order.isDelivered) {
        return res.status(400).json({ message: 'Order is already delivered' });
      }

      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.status(200).json({ message: 'Order Delivered' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating delivery status', error: error.message });
    }
  })
);

// Delete order
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order Not Found' });
      }
      await order.deleteOne();
      res.status(200).json({ message: 'Order Deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
  })
);

export default orderRouter;
