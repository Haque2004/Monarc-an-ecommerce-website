const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const User = require("./models/User");

dotenv.config();

const ensureAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  try {
    const email = ADMIN_EMAIL.toLowerCase();
    let user = await User.findOne({ email });

    if (user) {
      if (user.role !== "admin" || !(await user.matchPassword(ADMIN_PASSWORD))) {
        user.role = "admin";
        user.password = ADMIN_PASSWORD;
        user.name = ADMIN_NAME || user.name || "Admin";
        await user.save();
        console.log(`Admin user updated: ${email}`.green);
      }
      return;
    }

    user = new User({
      name: ADMIN_NAME || "Admin",
      email,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    await user.save();
    console.log(`Admin user created: ${email}`.green);
  } catch (error) {
    console.error(`Admin initialization failed: ${error.message}`.red);
  }
}

connectDB().then(() => ensureAdmin());

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("MONARC API Running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MONARC Backend Running",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/products", require("./routes/productRoutes"));

app.use("/api/contact", require("./routes/contactRoutes"));

app.use("/api/orders", require("./routes/orderRoutes"));

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "..", "frontend", "dist"))
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "frontend", "dist", "index.html")
    );
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running on Port ${PORT}`.yellow.bold
  );
});