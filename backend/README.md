# ChatFlow Backend 🚀

Real-time chat app backend — Node.js · Express · Socket.io · MongoDB

## Quick Start

```bash
# 1. Install deps
npm install

# 2. Edit .env (see below)

# 3. Seed default rooms (optional)
node seed.js

# 4. Run
npm run dev      # development (nodemon)
npm start        # production
```

## .env Setup

```
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster0.mongodb.net/chatapp?retryWrites=true&w=majority
JWT_SECRET=change_this_to_something_long_and_random
CLIENT_URL=http://localhost:5173
```

- Get a free MongoDB Atlas cluster at https://mongodb.com/atlas
- Generate a strong JWT_SECRET (e.g. `openssl rand -hex 32`)

## API Reference

### Auth  `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me` · `GET /api/auth/users`
### Rooms  `GET /api/rooms` · `POST /api/rooms` · `POST /api/rooms/:id/join`
### Messages  `GET /api/messages/:roomId` · `POST /api/messages`

All protected routes require: `Authorization: Bearer <token>`

## Socket Events

| Client → Server | Payload |
|---|---|
| `join_room` | `roomId` |
| `leave_room` | `roomId` |
| `send_message` | `{ roomId, text }` |
| `typing_start` | `{ roomId }` |
| `typing_stop` | `{ roomId }` |

| Server → Client | Payload |
|---|---|
| `receive_message` | Message object |
| `online_users` | Array of online users |
| `user_typing` | `{ userId, name, roomId }` |
| `user_stopped_typing` | `{ userId, roomId }` |
| `user_joined` | User info + roomId |

## Connecting the React Frontend

In the React app, point `API` and `SOCKET_URL` to your server:

```js
const API = "http://localhost:5000/api";       // or your deployed URL
const SOCKET_URL = "http://localhost:5000";
```

Install socket.io-client in your Vite/React project:

```bash
npm install socket.io-client
```

Then replace the MockSocket shim with:

```js
import { io } from "socket.io-client";
const socket = io(SOCKET_URL, { auth: { token: user.token } });
```
