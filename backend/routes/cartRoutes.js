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

// **Récupérer un article du panier par ID**
/*router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findByPk(id, {
      include: Product,
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error when retrieving cart item' });
  }
});*/

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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error when updating cart item' });
  }
});

// **Supprimer un article du panier**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when deleting cart item' });
  }
});

module.exports = router;
