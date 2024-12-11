const express = require('express');
const Admin = require('../models/Admin'); 

const router = express.Router();

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { user_id, permissions } = req.body;
  try {
    const newAdmin = await Admin.create({ user_id, permissions });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: 'Error when admin creation' });
  }
});

// **CRUD - Read (All Admins)**

router.get('/', async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Error when admin recuperation' });
  }
});

// **CRUD - Read (One Admin)**

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific admin recuperation' });
  }
});

// **CRUD - Update**

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, permissions } = req.body;
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    admin.user_id = user_id;
    admin.permissions = permissions;
    await admin.save();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Error when admin update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    await admin.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when admin suppression' });
  }
});

module.exports = router;
