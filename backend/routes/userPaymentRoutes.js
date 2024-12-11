const express = require('express');
const UserPayment = require('../models/UserPayment'); 

const router = express.Router();

// **CRUD - Create**
router.post('/', async (req, res) => {
  const { user_id, payment_type, provider, account_token } = req.body;
  try {
    const newUserPayment = await UserPayment.create({ user_id, payment_type, provider, account_token });
    res.status(201).json(newUserPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error when user payment creation' });
  }
});

// **CRUD - Read (All User Payments)**
router.get('/', async (req, res) => {
  try {
    const userPayments = await UserPayment.findAll();
    res.status(200).json(userPayments);
  } catch (error) {
    res.status(500).json({ error: 'Error when user payment recuperation' });
  }
});

// **CRUD - Read (One User Payment)**
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userPayment = await UserPayment.findByPk(id);
    if (!userPayment) {
      return res.status(404).json({ error: 'User payment not found' });
    }
    res.status(200).json(userPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific user payment recuperation' });
  }
});

// **CRUD - Update**
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, payment_type, provider, account_token } = req.body;
  try {
    const userPayment = await UserPayment.findByPk(id);
    if (!userPayment) {
      return res.status(404).json({ error: 'User payment not found' });
    }
    userPayment.user_id = user_id;
    userPayment.payment_type = payment_type;
    userPayment.provider = provider;
    userPayment.account_token = account_token;
    await userPayment.save();
    res.status(200).json(userPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error when user payment update' });
  }
});

// **CRUD - Delete**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userPayment = await UserPayment.findByPk(id);
    if (!userPayment) {
      return res.status(404).json({ error: 'User payment not found' });
    }
    await userPayment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when user payment suppression' });
  }
});

module.exports = router;
