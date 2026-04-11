const express    = require("express");
const router     = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole    = require("../middleware/roleMiddleware");

const {
  bookRoom,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  updateReceipt,
} = require("../controllers/bookingController");

// ── User Routes (Login hona chahiye) ─────────────────────────────
router.post("/",           authMiddleware, bookRoom);          // Room book karo
router.get("/my",          authMiddleware, getMyBookings);     // Apni bookings dekho
router.patch("/receipt/:id", authMiddleware, updateReceipt);  // Receipt URL save karo

// ── Rector / Admin Routes ─────────────────────────────────────────
router.get("/all",         
  authMiddleware, 
  requireRole("admin", "rector", "principal"), 
  getAllBookings
);
router.patch("/approve/:id", 
  authMiddleware, 
  requireRole("admin", "rector", "principal"), 
  approveBooking
);
router.patch("/reject/:id",  
  authMiddleware, 
  requireRole("admin", "rector", "principal"), 
  rejectBooking
);

module.exports = router;