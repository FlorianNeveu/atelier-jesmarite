const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, "secret");
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = verifyToken;
