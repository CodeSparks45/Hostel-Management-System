const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

// ✅ GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("room");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE ROOM
const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBookings,
  deleteRoom,
  getAllUsers,
};