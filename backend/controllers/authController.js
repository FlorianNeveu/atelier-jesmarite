const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Récupération de la clé secrète depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;

// Pour s'inscrire
const register = async (req, res) => {
  const { first_name, last_name, email, password, telephone } = req.body; 

  try {

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      telephone
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json({ message: "Utilisateur enregistré avec succès", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pour se connecter
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "L'adresse email n'a pas été trouvée" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000 // 24h en ms
    });

    res.status(200).json({ 
      user: { 
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pour se déconnecter
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Déconnexion réussie" });
};

const getAll = async (req, res) => {
  const users = await User.find();
  res.json(users);
}

module.exports = { register, login, logout, getAll };