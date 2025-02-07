const express = require('express');
const Payment = require('../models/PaymentDetails'); 

const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/auth'); 
const { verify } = require('jsonwebtoken');
router.use(verifyToken);
router.use(isAdmin); 

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { amount, provider, status } = req.body;
  try {
    const newPayment = await Payment.create({ amount, provider, status });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error when payment creation' });
  }
});

// **CRUD - Read (All Payments)**

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error when payment recuperation' });
  }
});

// **CRUD - Read (One Payment)**

router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific payment recuperation' });
  }
});

// **CRUD - Update**

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { amount, provider, status } = req.body;
  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    payment.amount = amount;
    payment.provider = provider;
    payment.status = status;
    await payment.save();
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error when payment update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    await payment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when payment suppression' });
  }
});

module.exports = router;
