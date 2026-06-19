const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

router.post("/register", asyncHandler(registerUser));

router.post("/login", asyncHandler(loginUser));

router.get("/profile", protect, asyncHandler(getProfile));

module.exports = router;