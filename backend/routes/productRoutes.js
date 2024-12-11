const express = require('express');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');  // Because we have a product category

const router = express.Router();

// **CRUD - Create**

router.post('/', async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  try {
    const newProduct = await Product.create({ name, description, price, quantity, category_id });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error when product creation' });
  }
});

// **CRUD - Read (All Products)**

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: ProductCategory,
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error when retrived all products' });
  }
});

// **CRUD - Read (One Product)**

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: ProductCategory,
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error when retrive one product' });
  }
});

// **CRUD - Update**

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not find for update' });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.category_id = category_id;
    await product.save();  // save changes
    res.status(200).json(product);  // update product
  } catch (error) {
    res.status(500).json({ error: 'Error when product update' });
  }
});

// **CRUD - Delete**

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found for deletion' });
    }
    await product.destroy();  // delete product
    res.status(204).send();  // 204 No Content
  } catch (error) {
    res.status(500).json({ error: 'Error when product suppresion' });
  }
});

module.exports = router;
