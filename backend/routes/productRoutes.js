const express = require("express");
const router = express.Router();
const multer = require("multer");
const asyncHandler = require("../middleware/asyncHandler");

const upload = multer({ storage: multer.memoryStorage() });

const {
  getProducts,
  getProductById,
  createProduct,
  uploadProductImages,
} = require("../controllers/productController");

const { updateProduct, deleteProduct } = require("../controllers/productController");

const { protect, isAdmin } = require("../middleware/auth");

router.get("/", asyncHandler(getProducts));

router.get("/:id", asyncHandler(getProductById));

router.post("/", protect, isAdmin, asyncHandler(createProduct));

router.put("/:id", protect, isAdmin, asyncHandler(updateProduct));

router.delete("/:id", protect, isAdmin, asyncHandler(deleteProduct));

// upload multiple images for a product (field name: images)
router.post(
  "/:id/images",
  protect,
  isAdmin,
  upload.array("images", 6),
  asyncHandler(uploadProductImages)
);

module.exports = router;