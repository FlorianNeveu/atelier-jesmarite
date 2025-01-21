const express = require("express");
const router = express.Router();

const { register, login, getAll } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get", verifyToken, getAll);

module.exports = router;

