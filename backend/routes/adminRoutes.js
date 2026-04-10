const express = require("express");
const router = express.Router();

const { deleteRoom, getAllUsers } = require("../controllers/adminController");
const { getAllBookings, approveBooking } = require("../controllers/bookingController");

// Aapke middlewares (ensure karna ye files exist karti hain)
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Get all bookings
router.get("/bookings", authMiddleware, adminMiddleware, getAllBookings);

// ✅ RECTOR APPROVES BOOKING HERE
router.put("/approve-booking/:id", authMiddleware, adminMiddleware, approveBooking);

// ✅ Standard Admin Tasks
router.delete("/room/:id", authMiddleware, adminMiddleware, deleteRoom);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;