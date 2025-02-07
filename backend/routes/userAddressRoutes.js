const express = require('express');
const UserAddress = require('../models/UserAddress'); 

const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/auth'); 
const { verify } = require('jsonwebtoken');


// **CRUD - Create**
router.post('/', verifyToken, async (req, res) => {
  const { user_id, address_line1, address_line2, city, postal_code, country, mobile } = req.body;
  try {
    const newUserAddress = await UserAddress.create({ user_id, address_line1, address_line2, city, postal_code, country, mobile });
    res.status(201).json(newUserAddress);
  } catch (error) {
    res.status(500).json({ error: 'Error when user address creation' });
  }
});

// **CRUD - Read (All User Addresses)**
router.get('/', verifyToken, async (req, res) => {
  try {
    const userAddresses = await UserAddress.findAll();
    res.status(200).json(userAddresses);
  } catch (error) {
    res.status(500).json({ error: 'Error when user address recuperation' });
  }
});

// **CRUD - Read (One User Address)**
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const userAddress = await UserAddress.findByPk(id);
    if (!userAddress) {
      return res.status(404).json({ error: 'User address not found' });
    }
    res.status(200).json(userAddress);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific user address recuperation' });
  }
});

// **CRUD - Update**
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { user_id, address_line1, address_line2, city, postal_code, country, mobile } = req.body;
  try {
    const userAddress = await UserAddress.findByPk(id);
    if (!userAddress) {
      return res.status(404).json({ error: 'User address not found' });
    }
    userAddress.user_id = user_id;
    userAddress.address_line1 = address_line1;
    userAddress.address_line2 = address_line2;
    userAddress.city = city;
    userAddress.postal_code = postal_code;
    userAddress.country = country;
    userAddress.mobile = mobile;
    await userAddress.save();
    res.status(200).json(userAddress);
  } catch (error) {
    res.status(500).json({ error: 'Error when user address update' });
  }
});

// **CRUD - Delete**
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const userAddress = await UserAddress.findByPk(id);
    if (!userAddress) {
      return res.status(404).json({ error: 'User address not found' });
    }
    await userAddress.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when user address suppression' });
  }
});

module.exports = router;
