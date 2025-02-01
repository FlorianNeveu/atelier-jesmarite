const express = require('express');
const ShoppingSession = require('../models/ShoppingSession'); 

const router = express.Router();

// **CRUD - Create**
router.post('/', async (req, res) => {
  const { user_id } = req.body;
  try {
    const newSession = await ShoppingSession.create({ user_id });
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Error when shopping session creation' });
  }
});

router.post('/', async (req, res) => {
  const { user_id } = req.body;

  try {
    // Vérifier si une session existe déjà pour cet utilisateur (s'il est connecté)
    let session;
    if (user_id) {
      session = await ShoppingSession.findOne({ where: { user_id } });
    }

    // Si aucune session trouvée, en créer une nouvelle
    if (!session) {
      session = await ShoppingSession.create({ user_id: user_id || null }); // null pour un invité
    }

    res.status(201).json(session);
  } catch (error) {
    console.error("❌ Erreur lors de la création de la session :", error);
    res.status(500).json({ error: 'Error when creating shopping session' });
  }
});

// **CRUD - Read (All Sessions)**
router.get('/', async (req, res) => {
  try {
    const sessions = await ShoppingSession.findAll();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Error when shopping session recuperation' });
  }
});

// **CRUD - Read (One Session)**
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const session = await ShoppingSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: 'Shopping session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error when specific shopping session recuperation' });
  }
});

// **CRUD - Update**
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const session = await ShoppingSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: 'Shopping session not found' });
    }
    session.user_id = user_id;
    await session.save();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error when shopping session update' });
  }
});

// **CRUD - Delete**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const session = await ShoppingSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: 'Shopping session not found' });
    }
    await session.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error when shopping session suppression' });
  }
});

module.exports = router;
