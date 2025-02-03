const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('./auth'); // Assure-toi d'importer les bons middlewares
const Product = require('../models/Product'); // Assure-toi que ton modèle Product est bien défini
const Admin = require('../models/Admin');  // Si tu veux aussi gérer des admins, assure-toi que ce modèle existe

// Appliquer le middleware de vérification de token et de rôle admin à toutes les routes suivantes
router.use(verifyToken);   // Vérifie que l'utilisateur est authentifié
router.use(isAdmin);       // Vérifie que l'utilisateur est un administrateur

// **CRUD - Create (Créer un produit)**
router.post('/products', async (req, res) => {
  const { name, description, price, quantity, image } = req.body;

  try {
    const newProduct = await Product.create({ 
      name, 
      description, 
      price, 
      quantity, 
      image 
    });

    res.status(201).json(newProduct); // Retourne le produit créé avec un statut 201
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
  }
});

// **CRUD - Read (Lire tous les produits)**
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll(); // Récupère tous les produits
    res.status(200).json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des produits" });
  }
});

// **CRUD - Read (Lire un produit spécifique par ID)**
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id); // Recherche un produit par son ID
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du produit" });
  }
});

// **CRUD - Update (Modifier un produit existant)**
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, image } = req.body;

  try {
    const product = await Product.findByPk(id);  // Trouve le produit avec l'ID fourni
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Mise à jour des champs du produit
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.image = image || product.image;

    await product.save();  // Sauvegarde les modifications
    res.status(200).json(product);  // Retourne le produit mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
  }
});

// **CRUD - Delete (Supprimer un produit)**
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id); // Recherche le produit par ID
    if (!product) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    await product.destroy(); // Supprime le produit
    res.status(204).send(); // Retourne un code 204 (aucun contenu)
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du produit" });
  }
});

// **CRUD - Create (Ajouter un admin) - OPTIONNEL (si nécessaire pour gérer les admins)**
// Cette route est pour ajouter un nouvel administrateur (par exemple via un super-admin).
router.post('/admins', async (req, res) => {
  const { user_id, permissions } = req.body;

  try {
    const newAdmin = await Admin.create({ user_id, permissions });
    res.status(201).json(newAdmin); // Retourne l'administrateur créé
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'administrateur' });
  }
});

// **CRUD - Read (Lire tous les administrateurs)**
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.findAll(); // Récupère tous les administrateurs
    res.status(200).json(admins);
  } catch (error) {
    console.error("Erreur lors de la récupération des administrateurs:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des administrateurs" });
  }
});

// **CRUD - Delete (Supprimer un administrateur)**
router.delete('/admins/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrateur non trouvé" });
    }

    await admin.destroy(); // Supprime l'administrateur
    res.status(204).send(); // Retourne un code 204 (aucun contenu)
  } catch (error) {
    console.error("Erreur lors de la suppression de l'administrateur:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'administrateur" });
  }
});

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, telephone, role } = req.body;

  // Vérifier si l'utilisateur qui fait la demande est un admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Accès refusé : réservé aux administrateurs" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Mise à jour des informations de l'utilisateur, mais empêcher de modifier le rôle si ce n'est pas un admin
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.telephone = telephone || user.telephone;

    // L'admin peut modifier le rôle si besoin, sinon on garde l'ancien rôle
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    await user.save(); // Sauvegarder les modifications
    res.status(200).json(user); // Retourner l'utilisateur mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
});


module.exports = router;
