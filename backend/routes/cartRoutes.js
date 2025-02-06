const express = require('express');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ShoppingSession = require("../models/ShoppingSession");

const router = express.Router();

// **Ajouter un produit au panier (Créer ou Mettre à jour)**
router.post("/", async (req, res) => {
  const { quantity, product_id, session_id } = req.body;

  try {
    let cartItem = await CartItem.findOne({ 
      where: { product_id, session_id } 
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      res.status(200).json(cartItem);
    } else {
      cartItem = await CartItem.create({ quantity, product_id, session_id });
      res.status(201).json(cartItem);
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout au panier :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout au panier" });
  }
});


// **Récupérer tous les articles du panier**
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: Product, // Inclure les détails des produits
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Error when retrieving cart items' });
  }
});

// Récupérer les articles du panier pour une session donnée
router.get('/:session_id', async (req, res) => {
  const { session_id } = req.params;
  console.log(`requete pour le panier de la session : ${session_id}`);
  try {
    const cartItems = await CartItem.findAll({
      where: { session_id },
      include: Product, 
    });

    if (!cartItems.length) {
      return res.status(404).json({ error: "Aucun produit trouvé dans ce panier." });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du panier :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du panier" });
  }
});



// **Mettre à jour la quantité d'un article dans le panier**
router.put('/:session_id/update', async (req, res) => {
  const { session_id } = req.params;
  const { product_id, quantity } = req.body;

  try {
    let cartItem = await CartItem.findOne({
      where: { product_id, session_id }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Produit non trouvé dans ce panier' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité :", error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du panier' });
  }
});

// **Supprimer un article du panier**
router.delete('/:session_id/product/:product_id', async (req, res) => {
  const { session_id, product_id } = req.params;

  try {
    const cartItem = await CartItem.findOne({
      where: { product_id, session_id }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Produit non trouvé dans ce panier' });
    }

    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

module.exports = router;
