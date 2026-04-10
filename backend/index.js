require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require('node-cron');

// ✨ [PHASE 1 IMPORTS] Security & Logging
const helmet = require("helmet");
const apiLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const Booking = require('./models/Booking');
const Room = require('./models/Room');

// Cron Job (Existing)
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

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ✨ [PHASE 1] Security Middlewares (Sabse upar)
app.use(helmet()); 
app.use('/api', apiLimiter); 

// Existing Middlewares
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Routes
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

// ✨ [PHASE 1] Cloudinary Test Route (Postman se image yahan bhejenge)
const upload = require('./middleware/uploadMiddleware');
app.post('/api/upload-test', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Koi file upload nahi hui bhai!' });
  }
  res.status(200).json({
    success: true,
    message: 'File successfully uploaded to Cloudinary! ☁️🚀',
    fileUrl: req.file.path // Yeh live URL dega
  });
});

// ✨ [PHASE 1] Logger Test Route
app.get('/test-error', (req, res) => {
  throw new Error("Yeh ek test error hai logger check karne ke liye!");
});

// ✨ [PHASE 1] Global Error Handler (SABSE AAKHRI MIDDLEWARE!)
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server started on port ${PORT}`); 
  console.log(`Server started on port ${PORT}`); 
});