
require("dotenv").config();


const express = require("express");
const cors = require("cors");

const cron = require('node-cron');
const Booking = require('./models/Booking');
const Room = require('./models/Room');

cron.schedule('*/10 * * * *', async () => {
  const now = new Date();
  const expired = await Booking.find({ 
    checkOutTime: { $lt: now }, 
    status: 'active' 
  });

  for (let b of expired) {
    b.status = 'expired';
    await b.save();
    // Room vacancy increase karo automatically
    await Room.findByIdAndUpdate(b.room, { $inc: { availableRooms: 1 } });
    console.log(`Room freed: Booking ${b._id} expired.`);
  }
});


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");


const app = express();

// 🔥 FIRST middleware
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/admin", adminRoutes);
// Test
app.get("/", (req, res) => {
  res.send("Server chal raha hai 🚀");
});

// Protected
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route 🔐",
    user: req.user,
  });
});

// Server start
app.listen(5000, () => {
  console.log("Server started on port 5000");
});