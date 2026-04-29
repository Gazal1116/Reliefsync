const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

require("./passport");

const authRoutes = require("./routes/authRoutes");
const reliefRoutes = require("./routes/reliefRoutes");
const requireAuth = require("./middleware/authmiddleware");
const User = require("./models/usermodel");

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "reliefsync-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend + DB Connected ");
});

app.use("/api/auth", authRoutes);

app.get("/api/user/profile/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.patch("/api/user/profile/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedFields = ["name", "email", "phone", "location", "bio", "avatar"];
    const updates = {};

    for (const field of allowedFields) {
      if (typeof req.body[field] !== "undefined") {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.use("/api/relief", reliefRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});