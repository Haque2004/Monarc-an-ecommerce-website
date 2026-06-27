const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const User = require("../models/User");

async function resetPassword() {
  try {
    // Works with either MONGODB_URI or MONGO_URI
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MongoDB URI not found in .env");
    }

    await mongoose.connect(uri);

    const user = await User.findOne({
      email: "admin@example.com",
    });

    if (!user) {
      console.log("❌ Admin user not found.");
      process.exit(1);
    }

    user.password = "Admin123456";
    user.role = "admin";

    await user.save();

    console.log("✅ Admin password reset successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

resetPassword();