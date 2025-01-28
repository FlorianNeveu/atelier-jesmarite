const express = require("express");
const router = express.Router();

const { register, login, getAll, logout } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/users", verifyToken, getAll);

module.exports = router;

