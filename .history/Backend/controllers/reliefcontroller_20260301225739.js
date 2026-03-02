const ReliefRequest = require("../models/reliefrequestmodel");

// CREATE RELIEF REQUEST
exports.createRelief = async (req, res) => {
  try {
    const { title, description, location, user } = req.body;

    const relief = new ReliefRequest({
      title,
      description,
      location,
      createdBy
    });

    await relief.save();

    res.status(201).json({
      message: "Relief Request Created Successfully",
      relief
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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