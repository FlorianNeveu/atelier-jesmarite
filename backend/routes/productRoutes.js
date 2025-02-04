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

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  const image = req.file ? `/assets/${req.file.filename}` : null; // Si une nouvelle image est téléchargée, on prend le chemin du fichier

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Mise à jour des champs du produit
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category_id = category_id || product.category_id;
    if (image) product.image = image;  // Si une nouvelle image est fournie, on la met à jour

    await product.save();
    res.status(200).json({ message: 'Produit mis à jour avec succès', product });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
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
