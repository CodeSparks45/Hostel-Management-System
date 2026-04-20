const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole    = require("../middleware/roleMiddleware");
const {
  bookRoom, bookGroupRooms, getMyBookings, getAllBookings,
  getRoomAvailability, approveBooking, rejectBooking,
  checkInBooking, updateReceipt
} = require("../controllers/bookingController");

// ✅ NEW PUBLIC ROUTE ADDED HERE (No token needed) ────────────
router.get("/public-summary", async (req, res) => {
  try {
    const Room    = require("../models/Room");
    const Booking = require("../models/Booking");

    const rooms = await Room.find({}, "number hostel availableRooms totalRooms");

    const activeBookings = await Booking.find(
      { paymentStatus: { $in: ["pending","approved"] }, status: { $ne: "cancelled" } },
      "room groupMembers"
    );

    const bookedIds = new Set();
    activeBookings.forEach(b => {
      if (b.room) bookedIds.add(b.room.toString());
      b.groupMembers?.forEach(m => { if (m.room) bookedIds.add(m.room.toString()); });
    });

    const totalRooms     = rooms.length;
    const bookedRooms    = rooms.filter(r => bookedIds.has(r._id.toString()) || r.availableRooms <= 0).length;
    const availableRooms = totalRooms - bookedRooms;

    res.json({ totalRooms, bookedRooms, availableRooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ─────────────────────────────────────────────────────────────

// ── Public (token chahiye) ────────────────────────────────────────
router.post("/",              authMiddleware, bookRoom);
router.post("/group",         authMiddleware, bookGroupRooms);
router.get("/my",             authMiddleware, getMyBookings);
router.patch("/receipt/:id",  authMiddleware, updateReceipt);
router.get("/room-status",    authMiddleware, getRoomAvailability);

// ── Rector/Admin ──────────────────────────────────────────────────
router.get("/all",
  authMiddleware, requireRole("admin","rector","principal","hod"), getAllBookings
);
router.patch("/approve/:id",
  authMiddleware, requireRole("admin","rector","principal","hod"), approveBooking
);
router.patch("/reject/:id",
  authMiddleware, requireRole("admin","rector","principal","hod"), rejectBooking
);

// ── Guard scanner ─────────────────────────────────────────────────
router.patch("/checkin/:id", authMiddleware, checkInBooking);

module.exports = router;