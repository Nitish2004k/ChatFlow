import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    const s = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token: user.token },
      transports: ["websocket"],
    });

    s.on("connect", () => console.log("Socket connected"));
    s.on("online_users", (users) => setOnlineUsers(users));
    s.on("disconnect", () => console.log("Socket disconnected"));

    setSocket(s);
    return () => s.disconnect();
  }, [user?.token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
