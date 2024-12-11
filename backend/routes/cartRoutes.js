const express = require('express');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const router = express.Router();

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { quantity, product_id, session_id } = req.body;
  try {
    const newCartItem = await CartItem.create({ quantity, product_id, session_id });
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error when cart item creation' });
  }
});

// **CRUD - Read (All Cart Items)**

router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: Product,  // Including product details
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Error when cart items recuperation' });
  }
});

// **CRUD - Read (One Cart Item)**

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findByPk(id, {
      include: Product,
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific cart item recuperation' });
  }
});

// **CRUD - Update**

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, product_id, session_id } = req.body;
  try {
    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    cartItem.quantity = quantity;
    cartItem.product_id = product_id;
    cartItem.session_id = session_id;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error when cart item update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when cart item suppression' });
  }
});

module.exports = router;
