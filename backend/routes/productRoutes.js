const express = require('express');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');  // Because we have a product category
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// **CRUD - Create**

router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  const image = req.file ? `/assets/${req.file.filename}` : null;

  try {
    const newProduct = await Product.create({ name, description, price, quantity, category_id, image });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error when product creation' });
  }
});

// **CRUD - Read (All Products)**

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: ProductCategory,
        as: 'category',
      }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
    res.status(500).json({ error: 'Error when retrived all products' });
  }
});

// **CRUD - Read (One Product)**

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: {
        model: ProductCategory,
        as: 'category',
      }
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
  const { name, description, price, quantity, category_id, image } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Mise à jour des champs
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (category_id) product.category_id = category_id;
    if (image) product.image = image;

    await product.save(); // Sauvegarde des modifications
    res.status(200).json({ message: 'Produit mis à jour avec succès', product });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit :', error);
    res.status(500).json({ error: 'Error when updating product' });
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
