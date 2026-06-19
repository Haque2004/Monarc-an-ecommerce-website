require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const email = process.env.ADMIN_EMAIL || process.argv[2];
const password = process.env.ADMIN_PASSWORD || process.argv[3];
const name = process.env.ADMIN_NAME || process.argv[4] || "Admin";

if (!email || !password) {
  console.error("Usage: set ADMIN_EMAIL and ADMIN_PASSWORD in env or pass as args: node createAdmin.js email@example.com password [Name]");
  process.exit(1);
}

(async () => {
  try {
    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
      user.role = "admin";
      user.password = password;
      user.name = name;
      await user.save();
      console.log(`Updated existing user ${email} to admin.`);
      process.exit(0);
    }

    user = new User({ name, email, password, role: "admin" });
    await user.save();

    console.log(`Created admin user: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
