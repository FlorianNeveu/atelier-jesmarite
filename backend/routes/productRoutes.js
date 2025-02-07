const cloudinary = require('cloudinary').v2;
const express = require('express');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const multer = require('multer');
const path = require('path');

const { verifyToken, isAdmin } = require('../middleware/auth'); 
router.use(verifyToken);
router.use(isAdmin); 


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

router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  let imageUrl = null;

  if (req.file) {
    try {
      // Conversion du buffer en base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      // Upload vers Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products"
      });
      imageUrl = result.secure_url;
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

router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.findAll({
      where: {
        category_id: categoryId,
      },
      include: {
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name', 'description'],
      }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits de la catégorie' });
  }
});

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

router.put('/:id', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  let imageUrl = null;

  if (req.file) {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "products"
      });
      imageUrl = result.secure_url;
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

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found for deletion' });
    }
    await product.destroy();
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Error when product suppresion' });
  }
});

module.exports = router;
