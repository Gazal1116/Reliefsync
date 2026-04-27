const express = require("express");
const requireAuth = require("../middleware/authmiddleware");
const {
  createRelief,
  getAllReliefs,
  getReliefById,
  updateReliefStatus,
  deleteRelief,
} = require("../controllers/reliefcontroller");

const router = express.Router();

router.post("/create", requireAuth, createRelief);
router.get("/all", requireAuth, getAllReliefs);
router.get("/:id", requireAuth, getReliefById);
router.put("/update/:id", requireAuth, updateReliefStatus);
router.delete("/delete/:id", requireAuth, deleteRelief);

module.exports = router;
