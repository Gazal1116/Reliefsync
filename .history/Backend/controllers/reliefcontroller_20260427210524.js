const ReliefRequest = require("../models/reliefrequestmodel");

// CREATE RELIEF REQUEST
exports.createRelief = async (req, res) => {
  try {
    const { title, description, location, priority, createdBy } = req.body;

    if (!title || !location) {
      return res.status(400).json({ message: "Title and location are required" });
    }

    const relief = new ReliefRequest({
      title,
      description: description || "",
      location,
      priority,
      status: "pending",
      createdBy: req.user?.userId || createdBy,
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

// GET RELIEF REQUESTS BY USER ID
exports.getReliefsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reliefs = await ReliefRequest.find({ createdBy: userId }).sort({ createdAt: -1 });

    res.status(200).json(reliefs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL RELIEF REQUESTS
exports.getAllReliefs = async (req, res) => {
  try {
    const reliefs = await ReliefRequest.find().sort({ createdAt: -1 });

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
    const normalizedStatus = String(req.body?.status || "completed").toLowerCase();

    if (normalizedStatus !== "completed") {
      return res.status(400).json({ message: "Only status 'completed' is allowed" });
    }

    const relief = await ReliefRequest.findById(req.params.id);

    if (!relief) {
      return res.status(404).json({ message: "Relief request not found" });
    }

    const actorRole = (req.user?.role || "").toLowerCase();
    const actorId = req.user?.userId ? String(req.user.userId) : "";

    if (actorRole !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can mark requests as completed" });
    }

    if (actorRole === "volunteer" && actorId) {
      if (relief.assignedTo && String(relief.assignedTo) !== actorId) {
        return res.status(403).json({ message: "This request is already assigned to another volunteer" });
      }
      relief.assignedTo = actorId;
      relief.completedBy = actorId;
    }

    relief.status = "completed";
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