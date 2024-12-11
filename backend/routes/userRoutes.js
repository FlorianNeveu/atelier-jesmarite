const express = require('express');
const User = require('../models/User'); 

const router = express.Router();

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { username, password, first_name, last_name, telephone } = req.body;
  try {
    const newUser = await User.create({ username, password, first_name, last_name, telephone });
    res.status(201).json(newUser); 
  } catch (error) {
    console.log('Error details:', error);
    res.status(500).json({ error: 'Error when user creation' });
  }
});

// **CRUD - Read (All Users)**

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();  
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error when user recuperation' });
  }
});

// **CRUD - Read (One User)**

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, first_name, last_name, telephone } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username;
    user.password = password;
    user.first_name = first_name;
    user.last_name = last_name;
    user.telephone = telephone;
    await user.save();  // save changes
    res.status(200).json(user);  // return update user
  } catch (error) {
    console.log('Error details:', error);
    res.status(500).json({ error: 'Error when user update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();  // delete user
    res.status(204).send();  // 204 No Content
  } catch (error) {
    res.status(500).json({ error: 'Error when user suppresion' });
  }
});

module.exports = router;
