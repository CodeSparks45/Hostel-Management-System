const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  bookRoom,
  getMyBookings,
  getAllBookings,
  getRoomAvailability,
  approveBooking,
  rejectBooking,
  checkInBooking,
  updateReceipt,
} = require("../controllers/bookingController");

// ── Public (login chahiye) ────────────────────────────────────────
router.post("/",               authMiddleware, bookRoom);
router.get("/my",              authMiddleware, getMyBookings);
router.patch("/receipt/:id",   authMiddleware, updateReceipt);

// ── Room availability — frontend ke liye ─────────────────────────
router.get("/room-status",     authMiddleware, getRoomAvailability);

// ── Rector/Admin only ─────────────────────────────────────────────
router.get("/all",
  authMiddleware,
  requireRole("admin", "rector", "principal", "hod"),
  getAllBookings
);
router.patch("/approve/:id",
  authMiddleware,
  requireRole("admin", "rector", "principal", "hod"),
  approveBooking
);
router.patch("/reject/:id",
  authMiddleware,
  requireRole("admin", "rector", "principal", "hod"),
  rejectBooking
);

// ── Guard scanner ────────────────────────────────────────────────
router.patch("/checkin/:id",
  authMiddleware,
  checkInBooking
);

module.exports = router;