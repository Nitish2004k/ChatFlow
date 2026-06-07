const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { protect } = require("../middleware/authMiddleware");

// @route  GET /api/rooms  — get all rooms
router.get("/", protect, async (req, res) => {
  try {
    const rooms = await Room.find().populate("members", "name avatar color status");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/rooms  — create a room
router.post("/", protect, async (req, res) => {
  const { name, icon, description } = req.body;
  try {
    const exists = await Room.findOne({ name });
    if (exists) return res.status(400).json({ message: "Room already exists" });

    const room = await Room.create({
      name,
      icon: icon || "💬",
      description,
      members: [req.user._id],
      createdBy: req.user._id,
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/rooms/:id/join  — join a room
router.post("/:id/join", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
