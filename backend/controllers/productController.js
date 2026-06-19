const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const normalizeGender = (gender) => {
  const value = String(gender || "unisex").trim().toLowerCase();
  return ["men", "women", "unisex"].includes(value) ? value : "unisex";
};

const getProducts = async (req, res) => {
  const products = await Product.find();

  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json(product);
};

const createProduct = async (req, res) => {
  // only admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { images = [], gender = "unisex", ...rest } = req.body;

  const product = await Product.create({
    ...rest,
    gender: normalizeGender(gender),
    images,
  });

  res.status(201).json(product);
};

// Upload product images (multipart/form-data)
const uploadProductImages = async (req, res) => {
  // only admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploads = [];

  for (const file of req.files) {
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "monarc/products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(buffer);
      });

    try {
      const result = await streamUpload(file.buffer);

      uploads.push({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.images = product.images.concat(uploads);

  await product.save();

  res.json(product);
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, description, category, gender, price, stock, featured } = req.body;

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (category !== undefined) product.category = category;
  if (gender !== undefined) product.gender = normalizeGender(gender);
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  if (featured !== undefined) product.featured = featured;

  await product.save();

  res.json(product);
};

// Delete product and its images (admin only)
const deleteProduct = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // delete images from Cloudinary
  if (product.images && product.images.length) {
    for (const img of product.images) {
      try {
        if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.warn("Failed to delete cloudinary image", img.public_id, err);
      }
    }
  }

  await Product.deleteOne({ _id: product._id });

  res.json({ message: "Product deleted" });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  uploadProductImages,
  // exports for new endpoints
  updateProduct,
  deleteProduct,
};
