const ReliefRequest = require("../models/reliefrequestmodel");

// CREATE RELIEF REQUEST

// GET ALL RELIEF REQUESTS
exports.getAllReliefs = async (req, res) => {
  try {
    const reliefs = await ReliefRequest.find().populate("createdBy", "name email");

    res.json(reliefs);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// delete
exports.deleteRelief = async (req, res) => {
  try {
    const reliefId = req.params.id;

    const deletedRelief = await ReliefRequest.findByIdAndDelete(reliefId);

    if (!deletedRelief) {
      return res.status(404).json({ message: "Relief not found" });
    }

    res.status(200).json({ message: "Relief deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};