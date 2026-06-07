const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Track online users: { socketId -> { userId, name, avatar, color } }
  const onlineUsers = new Map();

  // Authenticate socket connection via JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.user;
    console.log(`🟢 ${user.name} connected (${socket.id})`);

    // Mark user online
    await User.findByIdAndUpdate(user._id, { status: "online" });
    onlineUsers.set(socket.id, {
      userId: user._id,
      name: user.name,
      avatar: user.avatar,
      color: user.color,
    });

    // Broadcast updated online users
    io.emit("online_users", Array.from(onlineUsers.values()));

    // ─── JOIN ROOM ─────────────────────────────────────────
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📌 ${user.name} joined room: ${roomId}`);

      // Notify others in room
      socket.to(roomId).emit("user_joined", {
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        color: user.color,
        roomId,
      });
    });

    // ─── LEAVE ROOM ────────────────────────────────────────
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left", { userId: user._id, name: user.name, roomId });
    });

    // ─── SEND MESSAGE ──────────────────────────────────────
    socket.on("send_message", async ({ roomId, text }) => {
      try {
        // Save to DB
        const message = await Message.create({
          room: roomId,
          sender: user._id,
          text,
        });
        const populated = await message.populate("sender", "name avatar color");

        // Broadcast to everyone in the room
        io.to(roomId).emit("receive_message", {
          _id: populated._id,
          room: roomId,
          sender: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            color: user.color,
          },
          text: populated.text,
          createdAt: populated.createdAt,
        });
      } catch (err) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ─── TYPING INDICATOR ──────────────────────────────────
    socket.on("typing_start", ({ roomId }) => {
      socket.to(roomId).emit("user_typing", { userId: user._id, name: user.name, roomId });
    });

    socket.on("typing_stop", ({ roomId }) => {
      socket.to(roomId).emit("user_stopped_typing", { userId: user._id, roomId });
    });

    // ─── DISCONNECT ────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log(`🔴 ${user.name} disconnected`);
      await User.findByIdAndUpdate(user._id, { status: "offline" });
      onlineUsers.delete(socket.id);
      io.emit("online_users", Array.from(onlineUsers.values()));
    });
  });

  return io;
};

module.exports = initSocket;
