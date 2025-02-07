const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


/*Verifie si un token est valide, si l'utilisateur existe et si l'utilisateur est un admin*/
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Pas de token" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decodedToken.id);
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

// Vérifier si l'utilisateur qui fait la demande est un admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès refusé : réservé aux administrateurs" });
    }
    next();
  };
  
module.exports = { verifyToken, isAdmin };


