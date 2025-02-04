const cloudinary = require('cloudinary').v2;
const express = require('express');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');  // Because we have a product category
const multer = require('multer');
const path = require('path');

// Commentaire sur multer classique
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});*/

// Multer + Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// **CRUD - Create**

router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  let imageUrl = null;

  
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Erreur de téléchargement vers Cloudinary' });
          }
          imageUrl = result.secure_url;
        }
      );
      req.file.stream.pipe(result);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors du téléchargement de l\'image' });
    }
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      quantity,
      category_id,
      image: imageUrl
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
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
  let imageUrl = null;

  // Si une nouvelle image est envoyée, la télécharger via Cloudinary
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "products" }, // Optionnel : pour organiser les images dans un dossier
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Erreur de téléchargement vers Cloudinary' });
          }
          imageUrl = result.secure_url; // URL de l'image
        }
      );
      req.file.stream.pipe(result);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors du téléchargement de l\'image' });
    }
  }

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
    if (imageUrl) product.image = imageUrl;  // Si une nouvelle image est fournie, on la met à jour

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
