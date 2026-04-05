const express = require("express");
const router = express.Router();
const { 
  bookRoom, 
  getMyBookings 
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Sare routes protected hain (authMiddleware)
router.post("/", authMiddleware, bookRoom);
router.get("/my", authMiddleware, getMyBookings);

// Agar aap delete functionality use kar rahe hain toh check karein controller mein hai ya nahi
// Filhal ise comment kar dete hain crash rokne ke liye
// router.delete("/:id", authMiddleware, cancelBooking); 

module.exports = router;
router.post("/confirm-payment", authMiddleware, async (req, res) => {
  const { duNumber, roomId, hostelName } = req.body;
  // Automatically create a booking with "approved" status because AI verified the DU format
  const booking = await Booking.create({
    user: req.user.id,
    room: roomId,
    duNumber,
    paymentStatus: "approved", // Load reducer!
    checkInTime: new Date(),
    checkOutTime: new Date(Date.now() + 24*60*60*1000) 
  });
  res.json(booking);
});