const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// @route  GET /api/messages/:roomId  — get messages for a room
router.get("/:roomId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate("sender", "name avatar color")
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/messages  — save a message (also done via socket)
router.post("/", protect, async (req, res) => {
  const { roomId, text } = req.body;
  try {
    const message = await Message.create({
      room: roomId,
      sender: req.user._id,
      text,
    });
    const populated = await message.populate("sender", "name avatar color");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
