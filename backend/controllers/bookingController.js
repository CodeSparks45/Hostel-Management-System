const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const mongoose = require("mongoose");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/emailService");

// ─────────────────────────────────────────────────────────────────
// POST /api/book/
// ─────────────────────────────────────────────────────────────────
const bookRoom = async (req, res) => {
  try {
    const { duNumber, hostelName, receiptUrl, roomNumber, roomId } = req.body;

    if (!duNumber || !hostelName) {
      return res.status(400).json({ message: "duNumber aur hostelName required hain." });
    }

    // ── STEP 1: Sahi room dhundo ──────────────────────────────────
    let room = null;

    // Priority 1: Valid MongoDB ObjectId aya toh seedha use karo
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      room = await Room.findById(roomId);
    }

    // Priority 2: roomNumber aur hostelName se dhundo (MAIN FIX)
    if (!room && roomNumber && hostelName) {
      room = await Room.findOne({
        number: roomNumber,
        $or: [
          { hostel: hostelName },
          { hostel: { $regex: hostelName.split(" ")[0], $options: "i" } }
        ]
      });
    }

    // Priority 3: hostelName se koi bhi available room
    if (!room) {
      room = await Room.findOne({
        $or: [
          { hostel: hostelName },
          { hostel: { $regex: hostelName.split(" ")[0], $options: "i" } }
        ],
        availableRooms: { $gt: 0 }
      });
    }

    // Priority 4: Koi bhi available room
    if (!room) {
      room = await Room.findOne({ availableRooms: { $gt: 0 } });
    }

    if (!room) {
      return res.status(404).json({ message: "Koi room available nahi hai. Baad mein try karein." });
    }

    // ── STEP 2: Room pehle se booked to nahi? ────────────────────
    const roomAlreadyBooked = await Booking.findOne({
      room: room._id,
      paymentStatus: { $in: ["pending", "approved"] },
      status: { $ne: "cancelled" }
    });

    if (roomAlreadyBooked) {
      // Agar specifically ye room book hai aur user ne ye hi choose ki
      if (roomNumber && room.number === roomNumber) {
        return res.status(400).json({
          message: `Room ${roomNumber} pehle se book ho chuki hai. Koi doosra room choose karein.`,
          roomTaken: true,
          roomNumber: roomNumber
        });
      }
      // Agar random room mili jo booked hai toh doosri dhundo
      const freeRoom = await Room.findOne({
        _id: { $ne: room._id },
        hostel: room.hostel,
        availableRooms: { $gt: 0 },
        // Kisi ki pending/approved booking nahi
        _id: {
          $nin: await Booking.distinct("room", {
            paymentStatus: { $in: ["pending", "approved"] },
            status: { $ne: "cancelled" }
          })
        }
      });

      if (!freeRoom) {
        return res.status(400).json({
          message: "Is hostel ki saari rooms abhi occupied hain.",
          roomTaken: true
        });
      }
      room = freeRoom;
    }

    // ── STEP 3: Same user ka same DU Number check ─────────────────
    const duplicateDU = await Booking.findOne({
      user: req.user.id,
      duNumber: duNumber.toUpperCase().trim()
    });

    if (duplicateDU) {
      return res.status(400).json({
        message: "Is DU Number se pehle se booking ho chuki hai.",
        booking: duplicateDU
      });
    }

    // ── STEP 4: User ki existing active booking check ─────────────
    const existingActiveBooking = await Booking.findOne({
      user: req.user.id,
      paymentStatus: { $in: ["pending", "approved"] },
      status: { $ne: "cancelled" }
    });

    if (existingActiveBooking) {
      return res.status(400).json({
        message: "Aapki pehle se ek active/pending booking hai. Pehle usse complete karein ya cancel karein.",
        booking: existingActiveBooking
      });
    }

    // ── STEP 5: Booking create + availability reduce ───────────────
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Room availability reduce karo atomically
      const updatedRoom = await Room.findOneAndUpdate(
        { _id: room._id, availableRooms: { $gt: 0 } },
        { $inc: { availableRooms: -1 } },
        { new: true, session }
      );

      if (!updatedRoom) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Room ${room.number} abhi fill ho gayi. Doosra room try karein.`,
          roomTaken: true
        });
      }

      const booking = await Booking.create([{
        user: req.user.id,
        room: room._id,
        hostelName: room.hostel,        // DB se sahi hostel name lo
        roomNumber: room.number,         // DB se sahi room number lo
        duNumber: duNumber.toUpperCase().trim(),
        receiptUrl: receiptUrl || "",
        paymentStatus: "pending",
        status: "active",
      }], { session });

      await session.commitTransaction();
      session.endSession();

      const populated = await Booking.findById(booking[0]._id)
        .populate("user", "name email phone")
        .populate("room", "number hostel type pricePerDay");

      return res.status(201).json({
        message: "Booking request submit ho gayi! Rector approval ka wait karein. ⏳",
        booking: populated
      });

    } catch (txErr) {
      await session.abortTransaction();
      session.endSession();
      throw txErr;
    }

  } catch (err) {
    console.error("❌ bookRoom error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
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
// GET /api/book/all — Rector/Admin
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
// GET /api/book/room-status — Frontend ke liye live availability
// ─────────────────────────────────────────────────────────────────
const getRoomAvailability = async (req, res) => {
  try {
    // Saari rooms ki current availability
    const rooms = await Room.find({}, "number hostel availableRooms totalRooms type gender pricePerDay");

    // Active bookings se booked rooms ki list
    const bookedRoomIds = await Booking.distinct("room", {
      paymentStatus: { $in: ["pending", "approved"] },
      status: { $ne: "cancelled" }
    });

    const availability = rooms.map(r => ({
      _id: r._id,
      number: r.number,
      hostel: r.hostel,
      type: r.type,
      gender: r.gender,
      pricePerDay: r.pricePerDay,
      availableRooms: r.availableRooms,
      totalRooms: r.totalRooms,
      isBooked: bookedRoomIds.some(id => id.toString() === r._id.toString()) || r.availableRooms <= 0
    }));

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// PATCH /api/book/approve/:id
// ─────────────────────────────────────────────────────────────────
const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user", "name email phone")
      .populate("room", "number hostel type availableRooms");

    if (!booking) return res.status(404).json({ message: "Booking nahi mili." });
    if (booking.paymentStatus === "approved") return res.status(400).json({ message: "Pehle se approve hai." });
    if (booking.paymentStatus === "rejected") return res.status(400).json({ message: "Rejected booking approve nahi ho sakti." });

    const checkIn = new Date();
    const checkOut = new Date(checkIn.getTime() + 24 * 60 * 60 * 1000);

    booking.paymentStatus = "approved";
    booking.checkInTime = checkIn;
    booking.checkOutTime = checkOut;
    // roomNumber already set hai booking mein
    await booking.save();

    // Email bhejo
    let emailResult = { success: false };
    if (booking.user?.email) {
      try {
        emailResult = await sendApprovalEmail(
          booking.user.email,
          booking.user.name,
          booking.roomNumber,
          booking.hostelName,
          checkIn,
          checkOut
        );
        if (emailResult.success) {
          booking.emailSent = true;
          await booking.save();
        }
      } catch (emailErr) {
        console.error("Email error (non-fatal):", emailErr.message);
      }
    }

    res.json({
      message: `✅ Approved! Room ${booking.roomNumber}. Email: ${emailResult.success ? "✅ Sent" : "⚠️ Failed (booking still approved)"}`,
      booking: {
        _id: booking._id,
        paymentStatus: booking.paymentStatus,
        roomNumber: booking.roomNumber,
        hostelName: booking.hostelName,
        checkInTime: booking.checkInTime,
        checkOutTime: booking.checkOutTime,
        emailSent: booking.emailSent,
        user: { name: booking.user.name, email: booking.user.email },
      }
    });
  } catch (err) {
    console.error("❌ approveBooking error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// PATCH /api/book/reject/:id
// ─────────────────────────────────────────────────────────────────
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id).populate("user", "name email");
    if (!booking) return res.status(404).json({ message: "Booking nahi mili." });
    if (booking.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Sirf pending bookings reject ho sakti hain." });
    }

    booking.paymentStatus = "rejected";
    booking.rejectionReason = reason || "Rector ne reject kiya.";
    await booking.save();

    // Room wapas available karo
    await Room.findByIdAndUpdate(booking.room, { $inc: { availableRooms: 1 } });

    if (booking.user?.email) {
      try {
        await sendRejectionEmail(booking.user.email, booking.user.name, booking.rejectionReason);
      } catch (e) {
        console.error("Rejection email failed:", e.message);
      }
    }

    res.json({ message: "❌ Rejected. Room wapas available. Email sent.", bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// PATCH /api/book/checkin/:id — Guard scanner
// ─────────────────────────────────────────────────────────────────
const checkInBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking nahi mili." });
    if (booking.paymentStatus !== "approved") {
      return res.status(400).json({ message: "Booking approved nahi hai." });
    }
    if (booking.checkInStatus === "checked_in") {
      return res.status(400).json({ message: "Already checked in." });
    }

    const now = new Date();
    const checkOut = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    booking.actualCheckInTime = now;
    booking.actualCheckOutTime = checkOut;
    booking.checkInTime = now;
    booking.checkOutTime = checkOut;
    booking.checkInStatus = "checked_in";
    await booking.save();

    res.json({
      message: "✅ Check-in successful! 24hr timer started.",
      checkInTime: now,
      checkOutTime: checkOut,
      booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
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
    if (!booking) return res.status(404).json({ message: "Booking nahi mili." });
    res.json({ message: "Receipt saved ✅", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bookRoom,
  getMyBookings,
  getAllBookings,
  getRoomAvailability,
  approveBooking,
  rejectBooking,
  checkInBooking,
  updateReceipt
};