require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const helmet = require("helmet");

const apiLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const Booking = require("./models/Booking");
const Room = require("./models/Room");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.set("trust proxy", 1);

// ✅ CORS — Vercel frontend allow
const allowedOrigins = [
  "http://localhost:3000",
  "https://hostel-management-system-psi-seven.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use("/api", apiLimiter);

connectDB();

// Cron: Mark expired bookings, free rooms
cron.schedule("*/10 * * * *", async () => {
  try {
    const now = new Date();
    const expired = await Booking.find({ checkOutTime: { $lt: now }, status: "active", paymentStatus: "approved" });
    for (let b of expired) {
      b.status = "expired";
      await b.save();
      await Room.findByIdAndUpdate(b.room, { $inc: { availableRooms: 1 } });
      logger.info(`Room freed: Booking ${b._id} expired`);
    }
  } catch (e) { logger.error("Cron error:", e.message); }
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("StayPG Backend Live 🚀"));

const upload = require("./middleware/uploadMiddleware");
app.post("/api/upload-test", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  res.json({ success: true, fileUrl: req.file.path });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server on port ${PORT}`);
  console.log(`✅ Server running on port ${PORT}`);
});