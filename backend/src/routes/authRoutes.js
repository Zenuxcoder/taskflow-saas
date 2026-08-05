const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;