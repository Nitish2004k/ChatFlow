import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import UserPanel from "../components/UserPanel";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  // Load rooms
  useEffect(() => {
    api.getRooms(user.token).then(setRooms).catch(console.error);
    api.getUsers(user.token).then(setUsers).catch(console.error);
  }, [user.token]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("user_typing", ({ name, roomId }) => {
      if (activeRoom?._id === roomId) {
        setTypingUsers(prev => prev.includes(name) ? prev : [...prev, name]);
      }
    });

    socket.on("user_stopped_typing", ({ name }) => {
      setTypingUsers(prev => prev.filter(n => n !== name));
    });

    socket.on("user_joined", ({ name, roomId }) => {
      // Refresh rooms to get updated member lists
      api.getRooms(user.token).then(setRooms);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
      socket.off("user_joined");
    };
  }, [socket, activeRoom, user.token]);

  // Load messages when room changes
  useEffect(() => {
    if (!activeRoom) return;
    setMessages([]);
    setTypingUsers([]);
    socket?.emit("join_room", activeRoom._id);
    api.getMessages(activeRoom._id, user.token).then(setMessages).catch(console.error);
  }, [activeRoom?._id]);

  const handleSelectRoom = (room) => {
    if (activeRoom) socket?.emit("leave_room", activeRoom._id);
    setActiveRoom(room);
  };

  const handleJoinRoom = async (room) => {
    try {
      await api.joinRoom(room._id, user.token);
      const updated = await api.getRooms(user.token);
      setRooms(updated);
      handleSelectRoom(room);
    } catch (err) { console.error(err); }
  };

  const handleCreateRoom = async ({ name, icon, description }) => {
    try {
      const room = await api.createRoom({ name, icon, description }, user.token);
      const updated = await api.getRooms(user.token);
      setRooms(updated);
      handleSelectRoom(room);
    } catch (err) { throw err; }
  };

  const handleSend = (text) => {
    if (!socket || !activeRoom) return;
    socket.emit("send_message", { roomId: activeRoom._id, text });
  };

  const handleTyping = (isTyping) => {
    if (!socket || !activeRoom) return;
    socket.emit(isTyping ? "typing_start" : "typing_stop", { roomId: activeRoom._id });
  };

  return (
    <div className="chat-root">
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onSelectRoom={handleSelectRoom}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        user={user}
        onlineUsers={onlineUsers}
        onLogout={logout}
        onToggleUsers={() => setShowUsers(v => !v)}
        showUsers={showUsers}
      />
      <ChatWindow
        room={activeRoom}
        messages={messages}
        user={user}
        onSend={handleSend}
        onTyping={handleTyping}
        typingUsers={typingUsers}
      />
      {showUsers && (
        <UserPanel users={users} onlineUsers={onlineUsers} onClose={() => setShowUsers(false)} />
      )}
    </div>
  );
}
