const express = require("express");
const router = express.Router();
const { getAllBookings, deleteRoom, getAllUsers } = require("../controllers/adminController");
const { approveBooking } = require("../controllers/bookingController"); // Import here

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Get all pending/active bookings
router.get("/bookings", authMiddleware, adminMiddleware, getAllBookings);

// ✅ NEW: Rector Sir approves the SBI Receipt
router.put("/approve-booking/:id", authMiddleware, adminMiddleware, approveBooking);

// ✅ Standard Admin Tasks
router.delete("/room/:id", authMiddleware, adminMiddleware, deleteRoom);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;