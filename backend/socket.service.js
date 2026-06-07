// src/services/socket.js
// Install socket.io-client first: npm install socket.io-client

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

export const connectSocket = (token) => {
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  socket.on("disconnect", () => console.log("❌ Socket disconnected"));
  socket.on("connect_error", (err) => console.error("Socket error:", err.message));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// ─── Room events ──────────────────────────────────────────
export const joinRoom = (roomId) => socket?.emit("join_room", roomId);
export const leaveRoom = (roomId) => socket?.emit("leave_room", roomId);

// ─── Message events ───────────────────────────────────────
export const sendMessage = (roomId, text) =>
  socket?.emit("send_message", { roomId, text });

export const onReceiveMessage = (callback) =>
  socket?.on("receive_message", callback);

// ─── Typing events ────────────────────────────────────────
export const emitTypingStart = (roomId) =>
  socket?.emit("typing_start", { roomId });

export const emitTypingStop = (roomId) =>
  socket?.emit("typing_stop", { roomId });

export const onUserTyping = (callback) =>
  socket?.on("user_typing", callback);

export const onUserStoppedTyping = (callback) =>
  socket?.on("user_stopped_typing", callback);

// ─── Online users ─────────────────────────────────────────
export const onOnlineUsers = (callback) =>
  socket?.on("online_users", callback);
