const Booking = require("../models/Booking");
const Room = require("../models/Room");

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
      duNumber: duNumber, // User SBI Collect se yaha reference ID dalega
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

// ✅ 3. APPROVE BOOKING (Used by Rector/Admin)
const approveBooking = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID
    const booking = await Booking.findById(id);

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
    booking.checkInTime = checkIn;
    booking.checkOutTime = checkOut;
    await booking.save();

    res.json({ message: "Booking Approved! Timer Started. ✅", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bookRoom,
  getMyBookings,
  approveBooking // Ise naya add kiya hai
};