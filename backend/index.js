require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const helmet = require("helmet");

// ✨ Security & Logging Imports
const apiLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const Booking = require('./models/Booking');
const Room = require('./models/Room');
const connectDB = require("./config/db");

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// CORS FIX: Allow Frontend to talk to Backend
app.use(cors({
  origin: "http://localhost:3000", // Tumhare React app ka URL
  credentials: true
}));
// ✨ Security Middlewares
app.use(helmet()); 
app.use('/api', apiLimiter); 

// Existing Middlewares
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Cron Job
cron.schedule('*/10 * * * *', async () => {
  const now = new Date();
  const expired = await Booking.find({ 
    checkOutTime: { $lt: now }, 
    status: 'active' 
  });

  for (let b of expired) {
    b.status = 'expired';
    await b.save();
    await Room.findByIdAndUpdate(b.room, { $inc: { availableRooms: 1 } });
    console.log(`Room freed: Booking ${b._id} expired.`);
  }
});

// Routes Use
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Server chal raha hai 🚀");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route 🔐",
    user: req.user,
  });
});

// Cloudinary Test Route
const upload = require('./middleware/uploadMiddleware');
app.post('/api/upload-test', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Koi file upload nahi hui bhai!' });
  }
  res.status(200).json({
    success: true,
    message: 'File successfully uploaded! ☁️🚀',
    fileUrl: req.file.path
  });
});

app.get('/test-error', (req, res) => {
  throw new Error("Test error for logger!");
});

// Global Error Handler
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server started on port ${PORT}`); 
  console.log(`Server started on port ${PORT}`); 
});