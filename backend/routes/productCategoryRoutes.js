const express = require('express');
const ProductCategory = require('../models/ProductCategory'); 

const router = express.Router();

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCategory = await ProductCategory.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error when category creation' });
  }
});

// **CRUD - Read (All Categories)**

router.get('/', async (req, res) => {
  try {
    const categories = await ProductCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error when category recuperation' });
  }
});

// **CRUD - Read (One Category)**

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific category recuperation' });
  }
});

// **CRUD - Update**

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    category.name = name;
    category.description = description;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error when category update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await category.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when category suppression' });
  }
});

module.exports = router;
