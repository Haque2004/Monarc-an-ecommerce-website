const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {
  createOrder,
  createSslcommerzSession,
  createBkashSession,
  handleSslcommerzIpn,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const { protect } = require("../middleware/auth");

router.post("/", asyncHandler(createOrder));
router.post("/sslcommerz", asyncHandler(createSslcommerzSession));
router.post("/bkash", asyncHandler(createBkashSession));
router.post("/sslcommerz/ipn", asyncHandler(handleSslcommerzIpn));

router.get("/myorders", protect, asyncHandler(getMyOrders));

router.get("/:id", protect, asyncHandler(getOrderById));

module.exports = router;