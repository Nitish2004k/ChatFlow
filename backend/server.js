const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const initSocket = require("./socket/socketHandler");

dotenv.config();

const app = express();
const server = http.createServer(app);


// Connect Database
connectDB();


// CORS Configuration (Vercel Frontend)
app.use(
  cors({
    origin: [
      "https://chatflow-frontend-five.vercel.app"
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],
  })
);


// Middleware
app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/messages", require("./routes/messages"));


// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "ChatFlow API running 🚀"
  });
});


// Socket.io
initSocket(server);


// Railway Port
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});


// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const initSocket = require("./socket/socketHandler");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // Connect Database
// connectDB();

// // Middleware
// // CORS: allow the CLIENT_URL set on Railway, and fall back to allowing
// // any origin if CLIENT_URL isn't set (good enough for getting things working)
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || true,
//     credentials: true,
//   })
// );
// app.use(express.json());

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/rooms", require("./routes/rooms"));
// app.use("/api/messages", require("./routes/messages"));

// // Health check
// app.get("/", (req, res) => res.json({ status: "ChatFlow API running 🚀" }));

// // Init Socket.io
// initSocket(server);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));










// const express = require("express");
// const http = require("http");
// const path = require("path");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const initSocket = require("./socket/socketHandler");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // Connect Database and start server afterwards
// connectDB()
//   .then(() => {
//     // Middleware
//     app.use(
//       cors({
//         origin: process.env.CLIENT_URL || true,
//         credentials: true,
//       })
//     );
//     app.use(express.json());

//     // Routes
//     app.use("/api/auth", require("./routes/auth"));
//     app.use("/api/rooms", require("./routes/rooms"));
//     app.use("/api/messages", require("./routes/messages"));

//     // Health check
//     app.get("/api/status", (req, res) => res.json({ status: "ChatFlow API running 🚀" }));

//     // Serve the frontend from the built static files
//     const frontendDistPath = path.join(__dirname, "../frontend/dist");
//     app.use(express.static(frontendDistPath));
//     app.get("*",(req, res) => {
//       if (req.path.startsWith("/api")) {
//         return res.status(404).json({ message: "API route not found" });
//       }
//       res.sendFile(path.join(frontendDistPath, "index.html"));
//     });

//     // Init Socket.io
//     initSocket(server);

//     const PORT = process.env.PORT || 5000;
//     server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error("❌ Failed to start server due to database connection error:", error);
//     process.exit(1);
//   });


