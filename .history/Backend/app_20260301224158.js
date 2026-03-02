require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { registerUser, loginUser } = require("./controllers/authcontroller");
const { createRelief, getAllReliefs } = require("./controllers/reliefController");


const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend + DB Connected 🚀");
});

app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});