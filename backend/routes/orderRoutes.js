const express = require('express');
const Order = require('../models/OrderDetails');
const OrderItem = require('../models/OrderItems');
const User = require('../models/User');
const Payment = require('../models/PaymentDetails');

const router = express.Router();

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { user_id, total, payment_id } = req.body;
  try {
    const newOrder = await Order.create({ user_id, total, payment_id });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error when order creation' });
  }
});

// **CRUD - Read (All Orders)**

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [User, Payment, OrderItem],  // Including related models
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error when orders recuperation' });
  }
});

// **CRUD - Read (One Order)**

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, {
      include: [User, Payment, OrderItem],
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific order recuperation' });
  }
});

// **CRUD - Update**

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, total, payment_id } = req.body;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.user_id = user_id;
    order.total = total;
    order.payment_id = payment_id;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error when order update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when order suppression' });
  }
});

module.exports = router;
