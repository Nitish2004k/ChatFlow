const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Room = require("./models/Room");
const connectDB = require("./config/db");

dotenv.config();

const defaultRooms = [
  { name: "General", icon: "🌐", description: "General discussion for everyone" },
  { name: "Dev Talk", icon: "💻", description: "All things development" },
  { name: "Design", icon: "🎨", description: "UI/UX and design discussion" },
  { name: "Random", icon: "🎲", description: "Off-topic fun" },
];

const seed = async () => {
  await connectDB();
  await Room.deleteMany({});
  await Room.insertMany(defaultRooms);
  console.log("✅ Default rooms seeded!");
  process.exit();
};

seed();
