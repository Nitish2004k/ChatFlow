# ⚡ ChatFlow — Full-Stack Real-Time Chat App

A production-ready real-time chat application built with **React + Vite** (frontend) and **Node.js + Express + Socket.IO + MongoDB** (backend).

---

## ✨ Features

| Feature | Detail |
|---|---|
| 🔐 Auth | JWT-based register/login with bcrypt password hashing |
| 💬 Real-time messaging | Socket.IO with room-based broadcasting |
| ✍️ Typing indicators | Live "user is typing…" with debounce |
| 🟢 Online presence | Real-time online/offline user tracking |
| 🏠 Rooms | Create, join, and browse chat rooms |
| 🎨 Avatar generation | Auto color + initials avatar on signup |
| 📜 Message history | Persisted to MongoDB, loaded on room join |

---

## 📁 Project Structure

```
chat-fullstack/
├── backend/           # Express + Socket.IO + MongoDB API
│   ├── config/        # DB connection
│   ├── middleware/    # JWT auth middleware
│   ├── models/        # User, Room, Message schemas
│   ├── routes/        # REST API routes
│   ├── socket/        # Socket.IO event handlers
│   ├── server.js      # Entry point
│   └── .env           # Backend environment variables
│
└── frontend/          # React + Vite SPA
    ├── src/
    │   ├── components/ # Sidebar, ChatWindow, UserPanel
    │   ├── context/    # AuthContext, SocketContext
    │   ├── pages/      # AuthPage, ChatPage
    │   ├── services/   # API fetch wrapper
    │   └── index.css   # Full design system
    ├── vite.config.js
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (or edit the existing one):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatflow
JWT_SECRET=your_super_secret_key_change_this
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

> API will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Copy the env example:

```bash
cp .env.example .env
```

`.env` contents:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

> App will be available at `http://localhost:3000`

---

## 🔌 API Reference

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/auth/users` | ✅ | List all other users |

### Rooms
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/rooms` | ✅ | List all rooms |
| POST | `/api/rooms` | ✅ | Create a room |
| POST | `/api/rooms/:id/join` | ✅ | Join a room |

### Messages
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/messages/:roomId` | ✅ | Get room messages (last 100) |
| POST | `/api/messages` | ✅ | Save a message (REST fallback) |

---

## ⚡ Socket.IO Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `join_room` | `roomId` | Join a chat room |
| `leave_room` | `roomId` | Leave a chat room |
| `send_message` | `{ roomId, text }` | Send a message |
| `typing_start` | `{ roomId }` | Start typing indicator |
| `typing_stop` | `{ roomId }` | Stop typing indicator |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `receive_message` | Message object | New message in room |
| `online_users` | User array | Updated online users list |
| `user_joined` | User info | Someone joined the room |
| `user_left` | User info | Someone left the room |
| `user_typing` | `{ name, roomId }` | Someone is typing |
| `user_stopped_typing` | `{ name, roomId }` | Someone stopped typing |

**Socket authentication**: Pass the JWT in the socket handshake:
```js
io(SERVER_URL, { auth: { token: "your-jwt-token" } })
```

---

## 🌐 Production Deployment

### Backend (e.g. Railway, Render, Heroku)
Set these environment variables:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (e.g. Vercel, Netlify)
```
VITE_API_URL=https://your-backend.railway.app
```

Build command: `npm run build`  
Output directory: `dist`

---

## 🛠 Tech Stack

**Frontend**: React 18, Vite, Socket.IO Client, CSS (custom design system)  
**Backend**: Node.js, Express, Socket.IO, Mongoose, JWT, bcryptjs  
**Database**: MongoDB
