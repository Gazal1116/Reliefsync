require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const user = require

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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});