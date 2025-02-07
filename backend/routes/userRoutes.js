const express = require('express');
const User = require('../models/User'); 
const { verify } = require('jsonwebtoken');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth'); 

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { password, first_name, last_name, telephone, email } = req.body;
  try {
    const newUser = await User.create({ email, password, first_name, last_name, telephone });
    res.status(201).json(newUser); 
  } catch (error) {
    console.log('Error details:', error);
    res.status(500).json({ error: 'Error when user creation' });
  }
});

// **CRUD - Read (All Users)**

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();  
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error when user recuperation' });
  }
});

// **CRUD - Read (One User)**

router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log('Error details:', error);
    res.status(500).json({ error: 'Error when specific user recuperation' });
  }
});

// **CRUD - Update**

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { email,  password, first_name, last_name, telephone } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.email = email;
    user.password = password;
    user.first_name = first_name;
    user.last_name = last_name;
    user.telephone = telephone;
    await user.save();
    res.status(200).json(user); 
  } catch (error) {
    console.log('Error details:', error);
    res.status(500).json({ error: 'Error when user update' });
  }
});

// **CRUD - Delete**

router.delete('/:id',verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy(); 
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when user suppresion' });
  }
});

module.exports = router;
