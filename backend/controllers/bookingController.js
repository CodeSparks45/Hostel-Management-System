const Booking = require("../models/Booking");
const Room = require("../models/Room");

// ✨ NAYA IMPORT: Email Service ko yahan bulaya
const { sendApprovalEmail } = require("../utils/emailService");

// ✅ 1. CREATE BOOKING REQUEST (Status: Pending)
const bookRoom = async (req, res) => {
  try {
    const { roomId, duNumber, hostelName } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Room full check
    if (room.availableRooms <= 0) {
      return res.status(400).json({ message: "Hostel is currently Full ❌" });
    }

    // Nayi booking create karo (Par abhi vacancy kam mat karo)
    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      hostelName: hostelName,
      duNumber: duNumber, 
      paymentStatus: "pending",
      status: "active"
    });

    res.json({ message: "Request Sent! Please wait for Rector approval. ⏳", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 2. MY BOOKINGS (With Timer Logic for Frontend)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 3. APPROVE BOOKING & SEND EMAIL (Used by Rector/Admin)
const approveBooking = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID
    
    // ⚠️ NAYA CHANGE: .populate("user") add kiya taaki hume student ka email mil sake
    const booking = await Booking.findById(id).populate("user");

    if (!booking) return res.status(404).json({ message: "Booking Request not found" });

    const room = await Room.findById(booking.room);
    
    // Check vacancy again at time of approval
    if (room.availableRooms <= 0) {
      return res.status(400).json({ message: "Room became full during pending status" });
    }

    // Timer Logic: Start 24 hours from NOW
    const checkIn = new Date();
    const checkOut = new Date(checkIn.getTime() + 24 * 60 * 60 * 1000);

    // Update Vacancy
    room.availableRooms -= 1;
    await room.save();

    // Update Booking Status
    booking.paymentStatus = "approved";
    booking.status = "approved"; // Ensuring main status is also approved
    booking.checkInTime = checkIn;
    booking.checkOutTime = checkOut;
    await booking.save();

    // 🚀 THE MAGIC: EMAIL BHEJNE KA LOGIC
    const user = booking.user;
    if (user && user.email) {
      // Room number bhej rahe hain (agar aapke Room schema mein 'number' field hai toh, warna room ka ID jayega)
      await sendApprovalEmail(user.email, user.name, room.number || "Assigned by Admin");
    }

    res.json({ message: "Booking Approved! Timer Started & Email Sent. ✅🚀", booking });
  } catch (err) {
    console.error("❌ Error in approval:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bookRoom,
  getMyBookings,
  approveBooking 
};