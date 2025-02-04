const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'None',
      domain: '.railway.app',
      maxAge: 86400000,
      path: '/'
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

const me = async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ user: null }); 
  }


  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ user: null });
    }


    const user = await User.findOne({ where: { id: decoded.id } });  
    if (!user) {
      return res.status(404).json({ user: null }); 
    }

    res.status(200).json({
      user: { id: user.id, role: user.role, email: user.email }  
    });
  });
};

// Pour se déconnecter
const logout = (req, res) => {
  res.clearCookie('token', {
    domain: '.railway.app',
    path: '/',
    secure: true,
    sameSite: 'None'
  });
  
  res.status(200).json({ message: 'Déconnexion réussie' });
};

const getAll = async (req, res) => {
  const users = await User.find();
  res.json(users);
}

module.exports = { register, login, logout, getAll };