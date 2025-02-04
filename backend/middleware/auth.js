const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

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

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès refusé : réservé aux administrateurs" });
    }
    next();
  };
  
module.exports = { verifyToken, isAdmin };


