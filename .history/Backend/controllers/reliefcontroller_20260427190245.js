const ReliefRequest = require("../models/reliefrequestmodel");

// CREATE RELIEF REQUEST
exports.createRelief = async (req, res) => {
  try {
    const { title, description, location, priority } = req.body;

    const relief = new ReliefRequest({
      title,
      description: description || "",
      location,
      priority,
      status: "Pending",
      createdBy: req.user?.userId,
    });

    await relief.save();

    res.status(201).json({
      message: "Relief Request Created Successfully",
      relief
    });

  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// GET ALL RELIEF REQUESTS
exports.getAllReliefs = async (req, res) => {
  try {
    const reliefs = await ReliefRequest.find();

    res.json(reliefs);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET SINGLE RELIEF REQUEST BY ID
exports.getReliefById = async (req, res) => {
  try {
    const relief = await ReliefRequest.findById(req.params.id);

    if (!relief) {
      return res.status(404).json({ message: "Relief request not found" });
    }

    res.status(200).json({ relief });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// UPDATE RELIEF REQUEST STATUS TO COMPLETED
exports.updateReliefStatus = async (req, res) => {
  try {
    const relief = await ReliefRequest.findById(req.params.id);

    if (!relief) {
      return res.status(404).json({ message: "Relief request not found" });
    }

    relief.status = "Completed";
    const updatedRelief = await relief.save();

    res.status(200).json({
      message: "Relief request marked as completed",
      relief: updatedRelief,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
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