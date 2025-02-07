const express = require("express");
const router = express.Router();

const { register, login, getAll, logout, me } = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/auth");


router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/users", verifyToken, isAdmin, getAll);
router.get("/me", verifyToken, isAdmin, me);

module.exports = router;

