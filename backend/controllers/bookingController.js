const Booking = require("../models/Booking");
const Room    = require("../models/Room");
const User    = require("../models/User");
const mongoose = require("mongoose");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/emailService");

// ─────────────────────────────────────────────────────────────────
// 🎬 SCENE 1 — User books a room (status: pending)
// POST /api/book/
// ─────────────────────────────────────────────────────────────────
const bookRoom = async (req, res) => {
  try {
    let { roomId, duNumber, hostelName, receiptUrl } = req.body;

    if (!duNumber || !hostelName) {
      return res.status(400).json({ message: "duNumber aur hostelName required hain." });
    }

    let room;
    // Agar valid 24-character MongoDB ID hai toh dhoondo
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      room = await Room.findById(roomId);
    } else {
      // Agar ID theek nahi aayi ("s1", etc), toh khud ek available room dhoondho!
      room = await Room.findOne({ availableRooms: { $gt: 0 } });
    }

    if (!room) {
      return res.status(404).json({ message: "Bhai, database mein koi room khali nahi hai. ❌" });
    }

    // Duplicate booking check — same user, same DU number
    const existing = await Booking.findOne({ 
      user: req.user.id, 
      duNumber: duNumber 
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: "Is DU Number se pehle se booking ho chuki hai.",
        booking: existing
      });
    }

    // ✅ Booking create karo — PENDING state mein
    const booking = await Booking.create({
      user:          req.user.id,
      room:          room._id, // Backend ne Asli ID nikal li
      hostelName:    hostelName,
      duNumber:      duNumber.toUpperCase().trim(),
      receiptUrl:    receiptUrl || "",
      paymentStatus: "pending",
      status:        "active",
    });

    const populated = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("room", "number hostel type pricePerDay");

    res.status(201).json({ 
      message: "Booking request submit ho gayi! Rector approval ka wait karein. ⏳", 
      booking: populated
    });

  } catch (err) {
    console.error("❌ bookRoom error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// My Bookings — Sirf logged-in user ki bookings
// GET /api/book/my
// ─────────────────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("room", "number hostel type pricePerDay amenities")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 🎬 SCENE 2 — Rector: Sabki pending bookings dekho
// GET /api/book/all  (admin/rector only)
// ─────────────────────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.paymentStatus = status;

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone role")
      .populate("room", "number hostel type pricePerDay")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// 🎬 SCENE 3 — Rector clicks APPROVE
// PATCH /api/book/approve/:id  (admin/rector only)
// ─────────────────────────────────────────────────────────────────
const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user", "name email phone")
      .populate("room", "number hostel type availableRooms");

    if (!booking) {
      return res.status(404).json({ message: "Booking nahi mili." });
    }

    if (booking.paymentStatus === "approved") {
      return res.status(400).json({ message: "Yeh booking pehle se approve hai." });
    }

    if (booking.paymentStatus === "rejected") {
      return res.status(400).json({ message: "Rejected booking approve nahi ho sakti." });
    }

    const room = await Room.findById(booking.room._id);
    if (!room || room.availableRooms <= 0) {
      return res.status(400).json({ 
        message: "Room abhi full ho gaya approval ke waqt. Doosra assign karein." 
      });
    }

    const checkIn  = new Date();
    const checkOut = new Date(checkIn.getTime() + 24 * 60 * 60 * 1000);

    room.availableRooms -= 1;
    
    // 🚀 THE SAFETY NET: Purane database records ko crash hone se bachayega
    if (!room.hostel) {
      room.hostel = "Sahyadri"; 
    }
    
    await room.save();

    booking.paymentStatus = "approved";
    booking.checkInTime   = checkIn;
    booking.checkOutTime  = checkOut;
    booking.roomNumber    = room.number;
    await booking.save();

    // 🚀 EMAIL BHEJO
    let emailResult = { success: false };
    if (booking.user?.email) {
      emailResult = await sendApprovalEmail(
        booking.user.email,
        booking.user.name,
        room.number,
        booking.hostelName,
        checkIn,
        checkOut
      );
      if (emailResult.success) {
        booking.emailSent = true;
        await booking.save();
      }
    }

    res.json({ 
      message: `✅ Booking approve ho gayi! Room ${room.number} allocate kiya. Email: ${emailResult.success ? "✅ Sent" : "⚠️ Failed (but booking approved)"}`,
      booking: {
        _id:           booking._id,
        paymentStatus: booking.paymentStatus,
        roomNumber:    booking.roomNumber,
        hostelName:    booking.hostelName,
        checkInTime:   booking.checkInTime,
        checkOutTime:  booking.checkOutTime,
        emailSent:     booking.emailSent,
        user: {
          name:  booking.user.name,
          email: booking.user.email,
        },
      }
    });

  } catch (err) {
    console.error("❌ approveBooking error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// Rector clicks REJECT
// PATCH /api/book/reject/:id
// ─────────────────────────────────────────────────────────────────
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id)
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking nahi mili." });
    }

    if (booking.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Sirf pending bookings reject ho sakti hain." });
    }

    booking.paymentStatus   = "rejected";
    booking.rejectionReason = reason || "Rector ne manually reject kiya.";
    await booking.save();

    if (booking.user?.email) {
      await sendRejectionEmail(
        booking.user.email,
        booking.user.name,
        booking.rejectionReason
      );
    }

    res.json({ 
      message: "❌ Booking reject kar di gayi. User ko email bhej diya.",
      bookingId: booking._id
    });

  } catch (err) {
    console.error("❌ rejectBooking error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// Receipt URL update
// PATCH /api/book/receipt/:id
// ─────────────────────────────────────────────────────────────────
const updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptUrl } = req.body;

    const booking = await Booking.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { receiptUrl },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking nahi mili ya aapki nahi hai." });
    }

    res.json({ message: "Receipt URL save ho gaya. ✅", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bookRoom,
  getMyBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  updateReceipt,
};