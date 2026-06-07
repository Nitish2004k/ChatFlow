const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}, token) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: (token) => request("/api/auth/me", {}, token),
  getUsers: (token) => request("/api/auth/users", {}, token),

  getRooms: (token) => request("/api/rooms", {}, token),
  createRoom: (body, token) => request("/api/rooms", { method: "POST", body: JSON.stringify(body) }, token),
  joinRoom: (id, token) => request(`/api/rooms/${id}/join`, { method: "POST" }, token),

  getMessages: (roomId, token) => request(`/api/messages/${roomId}`, {}, token),
};
