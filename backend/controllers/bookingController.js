const Booking  = require("../models/Booking");
const Room     = require("../models/Room");
const User     = require("../models/User");
const mongoose = require("mongoose");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/emailService");

// ─────────────────────────────────────────────────────────────────
// HELPER: Find room by number + hostel
// ─────────────────────────────────────────────────────────────────
const findRoomByNumber = async (roomNumber, hostelHint) => {
  let room = null;
  if (roomNumber && hostelHint) {
    room = await Room.findOne({
      number: roomNumber,
      $or: [
        { hostel: hostelHint },
        { hostel: { $regex: hostelHint.split(" ")[0], $options: "i" } }
      ]
    });
  }
  if (!room && roomNumber) {
    room = await Room.findOne({ number: roomNumber });
  }
  return room;
};

// ─────────────────────────────────────────────────────────────────
// HELPER: Check if room is already booked
// ─────────────────────────────────────────────────────────────────
const isRoomBooked = async (roomId, excludeBookingId = null) => {
  const query = {
    $or: [
      { room: roomId },
      { "groupMembers.room": roomId }
    ],
    paymentStatus: { $in: ["pending", "approved"] },
    status: { $ne: "cancelled" }
  };
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  const existing = await Booking.findOne(query);
  return !!existing;
};

// ─────────────────────────────────────────────────────────────────
// GET /api/book/room-status — Live availability for frontend
// ─────────────────────────────────────────────────────────────────
const getRoomAvailability = async (req, res) => {
  try {
    const rooms = await Room.find(
      {},
      "number hostel availableRooms totalRooms type gender pricePerDay"
    );

    // All booked room IDs from both individual and group bookings
    const activeBookings = await Booking.find(
      {
        paymentStatus: { $in: ["pending", "approved"] },
        status: { $ne: "cancelled" }
      },
      "room groupMembers"
    );

    const bookedRoomIds = new Set();
    activeBookings.forEach(b => {
      if (b.room) bookedRoomIds.add(b.room.toString());
      if (b.groupMembers?.length) {
        b.groupMembers.forEach(m => {
          if (m.room) bookedRoomIds.add(m.room.toString());
        });
      }
    });

    const availability = rooms.map(r => ({
      _id:            r._id,
      number:         r.number,
      hostel:         r.hostel,
      type:           r.type,
      gender:         r.gender,
      pricePerDay:    r.pricePerDay,
      availableRooms: r.availableRooms,
      totalRooms:     r.totalRooms,
      isBooked:       bookedRoomIds.has(r._id.toString()) || r.availableRooms <= 0
    }));

    // Summary for disclaimer
    const totalRooms     = rooms.length;
    const bookedRooms    = availability.filter(r => r.isBooked).length;
    const availableRooms = totalRooms - bookedRooms;

    res.json({ rooms: availability, summary: { totalRooms, bookedRooms, availableRooms } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// POST /api/book/ — Individual Booking
// ─────────────────────────────────────────────────────────────────
const bookRoom = async (req, res) => {
  try {
    const { duNumber, hostelName, receiptUrl, roomNumber, roomId } = req.body;

    if (!duNumber || !hostelName) {
      return res.status(400).json({ message: "duNumber aur hostelName required hain." });
    }

    // Find room
    let room = null;
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      room = await Room.findById(roomId);
    }
    if (!room) {
      room = await findRoomByNumber(roomNumber, hostelName);
    }
    if (!room) {
      return res.status(404).json({ message: "Room nahi mili. Explorer se dobara book karein." });
    }

    // Room already booked?
    const alreadyBooked = await isRoomBooked(room._id);
    if (alreadyBooked) {
      return res.status(400).json({
        message: `Room ${room.number} pehle se book ho chuki hai. Doosra room choose karein.`,
        roomTaken: true,
        roomNumber: room.number
      });
    }

    // Duplicate DU check
    const dupDU = await Booking.findOne({ duNumber: duNumber.toUpperCase().trim() });
    if (dupDU) {
      return res.status(400).json({ message: "Is DU Number se booking pehle se ho chuki hai." });
    }

    // User ki existing active booking
    const existingActive = await Booking.findOne({
      user: req.user.id,
      paymentStatus: { $in: ["pending", "approved"] },
      status: { $ne: "cancelled" }
    });
    if (existingActive) {
      return res.status(400).json({
        message: "Aapki pehle se ek active booking hai.",
        booking: existingActive
      });
    }

    // Atomic transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedRoom = await Room.findOneAndUpdate(
        { _id: room._id, availableRooms: { $gt: 0 } },
        { $inc: { availableRooms: -1 } },
        { new: true, session }
      );
      if (!updatedRoom) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Room ${room.number} fill ho gayi. Doosra choose karein.`, roomTaken: true });
      }

      const booking = await Booking.create([{
        user:          req.user.id,
        room:          room._id,
        bookingType:   "individual",
        hostelName:    room.hostel,
        roomNumber:    room.number,
        duNumber:      duNumber.toUpperCase().trim(),
        receiptUrl:    receiptUrl || "",
        paymentStatus: "pending",
        status:        "active",
      }], { session });

      await session.commitTransaction();
      session.endSession();

      const populated = await Booking.findById(booking[0]._id)
        .populate("user", "name email phone")
        .populate("room", "number hostel type pricePerDay");

      return res.status(201).json({
        message: "Booking request submit! Rector approval ka wait karein. ⏳",
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
// POST /api/book/group — Group Booking
// ─────────────────────────────────────────────────────────────────
const bookGroupRooms = async (req, res) => {
  try {
    const {
      duNumber,
      groupName,
      members,    // Array: [{name, designation, gender, mobile, roomNumber, hostelName}]
      receiptUrl,
      totalAmount
    } = req.body;

    // Validation
    if (!duNumber || !members?.length) {
      return res.status(400).json({ message: "duNumber aur members required hain." });
    }
    if (members.length > 10) {
      return res.status(400).json({ message: "Maximum 10 members per group booking." });
    }
    if (members.length < 2) {
      return res.status(400).json({ message: "Group booking ke liye minimum 2 members chahiye." });
    }

    // Validate each member has required fields
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.gender || !m.roomNumber || !m.hostelName) {
        return res.status(400).json({
          message: `Member ${i + 1} ki details incomplete hain. Name, gender, room zaroori hain.`
        });
      }
    }

    // Duplicate DU check
    const dupDU = await Booking.findOne({ duNumber: duNumber.toUpperCase().trim() });
    if (dupDU) {
      return res.status(400).json({ message: "Is DU Number se booking pehle se ho chuki hai." });
    }

    // User ki existing active booking
    const existingActive = await Booking.findOne({
      user: req.user.id,
      paymentStatus: { $in: ["pending", "approved"] },
      status: { $ne: "cancelled" }
    });
    if (existingActive) {
      return res.status(400).json({ message: "Aapki pehle se ek active booking hai." });
    }

    // Find and validate all rooms
    const resolvedMembers = [];
    const roomsToBook = [];
    const usedRoomIds = new Set();

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const room = await findRoomByNumber(m.roomNumber, m.hostelName);

      if (!room) {
        return res.status(404).json({
          message: `Member "${m.name}" ke liye room ${m.roomNumber} nahi mila.`
        });
      }

      // Same room twice check
      if (usedRoomIds.has(room._id.toString())) {
        return res.status(400).json({
          message: `Room ${room.number} do members ke liye select nahi ho sakta.`
        });
      }

      // Gender check
      if (room.gender !== "any" && room.gender !== m.gender) {
        return res.status(400).json({
          message: `Room ${room.number} sirf ${room.gender} ke liye available hai. ${m.name} (${m.gender}) is room mein nahi reh sakte.`
        });
      }

      // Already booked check
      const alreadyBooked = await isRoomBooked(room._id);
      if (alreadyBooked) {
        return res.status(400).json({
          message: `Room ${room.number} pehle se kisi ne book kar li hai. Doosra room choose karein.`,
          roomTaken: true,
          roomNumber: room.number
        });
      }

      usedRoomIds.add(room._id.toString());
      roomsToBook.push(room);
      resolvedMembers.push({
        name:        m.name,
        designation: m.designation || "",
        gender:      m.gender,
        mobile:      m.mobile || "",
        room:        room._id,
        roomNumber:  room.number,
        hostelName:  room.hostel,
        emailSent:   false,
      });
    }

    // Atomic transaction — book all rooms
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Reduce availability for all rooms
      for (const room of roomsToBook) {
        const updated = await Room.findOneAndUpdate(
          { _id: room._id, availableRooms: { $gt: 0 } },
          { $inc: { availableRooms: -1 } },
          { new: true, session }
        );
        if (!updated) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Room ${room.number} abhi fill ho gayi. Dobara try karein.`,
            roomTaken: true
          });
        }
      }

      // Create single group booking
      const booking = await Booking.create([{
        user:          req.user.id,
        bookingType:   "group",
        groupName:     groupName || `Group of ${members.length}`,
        groupSize:     members.length,
        groupMembers:  resolvedMembers,
        totalAmount:   totalAmount || (members.length * 450),
        duNumber:      duNumber.toUpperCase().trim(),
        receiptUrl:    receiptUrl || "",
        paymentStatus: "pending",
        status:        "active",
      }], { session });

      await session.commitTransaction();
      session.endSession();

      const populated = await Booking.findById(booking[0]._id)
        .populate("user", "name email phone")
        .populate("groupMembers.room", "number hostel type pricePerDay");

      return res.status(201).json({
        message: `Group booking of ${members.length} members submit! Rector approval ka wait karein. ⏳`,
        booking: populated
      });

    } catch (txErr) {
      await session.abortTransaction();
      session.endSession();
      throw txErr;
    }

  } catch (err) {
    console.error("❌ bookGroupRooms error:", err);
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
      .populate("groupMembers.room", "number hostel type pricePerDay")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /api/book/all — Rector
// ─────────────────────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.paymentStatus = status;

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone role")
      .populate("room", "number hostel type pricePerDay")
      .populate("groupMembers.room", "number hostel type")
      .sort({ createdAt: -1 });
    res.json(bookings);
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
      .populate("room", "number hostel type")
      .populate("groupMembers.room", "number hostel");

    if (!booking) return res.status(404).json({ message: "Booking nahi mili." });
    if (booking.paymentStatus === "approved") return res.status(400).json({ message: "Pehle se approve hai." });
    if (booking.paymentStatus === "rejected") return res.status(400).json({ message: "Rejected approve nahi ho sakti." });

    const checkIn  = new Date();
    const checkOut = new Date(checkIn.getTime() + 24 * 60 * 60 * 1000);

    booking.paymentStatus = "approved";
    booking.checkInTime   = checkIn;
    booking.checkOutTime  = checkOut;
    await booking.save();

    let emailResult = { success: false };

    // Individual booking email
    if (booking.bookingType === "individual" && booking.user?.email) {
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
      } catch (e) {
        console.error("Email error:", e.message);
      }
    }

    // Group booking — email to each member + leader
    if (booking.bookingType === "group") {
      let anyEmailSent = false;

      // Email to group leader
      if (booking.user?.email) {
        try {
          const memberList = booking.groupMembers.map(m =>
            `${m.name} — Room ${m.roomNumber} (${m.hostelName})`
          ).join("\n");

          await sendGroupApprovalEmail(
            booking.user.email,
            booking.user.name,
            booking.groupName,
            booking.groupMembers,
            checkIn,
            checkOut
          );
          anyEmailSent = true;
        } catch (e) {
          console.error("Group leader email error:", e.message);
        }
      }

      if (anyEmailSent) {
        booking.emailSent = true;
        await booking.save();
      }
      emailResult.success = anyEmailSent;
    }

    res.json({
      message: `✅ ${booking.bookingType === "group" ? "Group " : ""}Approved! Email: ${emailResult.success ? "✅ Sent" : "⚠️ Failed"}`,
      booking: {
        _id:           booking._id,
        bookingType:   booking.bookingType,
        paymentStatus: booking.paymentStatus,
        roomNumber:    booking.roomNumber,
        hostelName:    booking.hostelName,
        groupName:     booking.groupName,
        groupSize:     booking.groupSize,
        checkInTime:   booking.checkInTime,
        checkOutTime:  booking.checkOutTime,
        emailSent:     booking.emailSent,
        user:          { name: booking.user.name, email: booking.user.email },
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

    booking.paymentStatus   = "rejected";
    booking.rejectionReason = reason || "Rector ne reject kiya.";
    await booking.save();

    // Restore availability
    if (booking.bookingType === "individual" && booking.room) {
      await Room.findByIdAndUpdate(booking.room, { $inc: { availableRooms: 1 } });
    }
    if (booking.bookingType === "group" && booking.groupMembers?.length) {
      for (const m of booking.groupMembers) {
        if (m.room) {
          await Room.findByIdAndUpdate(m.room, { $inc: { availableRooms: 1 } });
        }
      }
    }

    if (booking.user?.email) {
      try {
        await sendRejectionEmail(booking.user.email, booking.user.name, booking.rejectionReason);
      } catch (e) {
        console.error("Rejection email failed:", e.message);
      }
    }

    res.json({ message: "❌ Rejected. Rooms wapas available. Email sent.", bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// PATCH /api/book/checkin/:id — Guard
// ─────────────────────────────────────────────────────────────────
const checkInBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking nahi mili." });
    if (booking.paymentStatus !== "approved") return res.status(400).json({ message: "Approved nahi hai." });
    if (booking.checkInStatus === "checked_in") return res.status(400).json({ message: "Already checked in." });

    const now      = new Date();
    const checkOut = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    booking.actualCheckInTime  = now;
    booking.actualCheckOutTime = checkOut;
    booking.checkInTime        = now;
    booking.checkOutTime       = checkOut;
    booking.checkInStatus      = "checked_in";
    await booking.save();

    res.json({ message: "✅ Check-in! 24hr timer started.", checkInTime: now, checkOutTime: checkOut, booking });
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

// ─────────────────────────────────────────────────────────────────
// Group Approval Email Helper
// ─────────────────────────────────────────────────────────────────
const sendGroupApprovalEmail = async (toEmail, leaderName, groupName, members, checkIn, checkOut) => {
  const { sendApprovalEmail: sae } = require("../utils/emailService");
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    connectionTimeout: 30000,
    tls: { rejectUnauthorized: false },
  });

  const fmt = (d) => new Date(d).toLocaleString("en-IN", {
    dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata"
  });

  const memberRows = members.map(m => `
    <tr style="border-bottom:1px solid #e0f2fe">
      <td style="padding:10px 8px;font-size:13px;font-weight:700;color:#0f172a">${m.name}</td>
      <td style="padding:10px 8px;font-size:13px;color:#64748b">${m.designation || "—"}</td>
      <td style="padding:10px 8px;font-size:13px;font-weight:700;color:#0ea5e9">Room ${m.roomNumber}</td>
      <td style="padding:10px 8px;font-size:13px;color:#64748b">${m.hostelName}</td>
    </tr>
  `).join("");

  await transporter.sendMail({
    from: `"StayPG — SGGSIE&T" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Group Booking Approved — ${groupName} — SGGSIE&T`,
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <style>
      body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f9ff;margin:0;padding:0}
      .wrap{max-width:620px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(14,165,233,.12)}
      .hdr{background:linear-gradient(135deg,#0ea5e9,#0d9488);padding:36px 40px;text-align:center}
      .hdr h1{color:#fff;font-size:26px;font-weight:900;margin:0}
      .hdr p{color:rgba(255,255,255,.8);font-size:12px;margin-top:6px;font-weight:600;text-transform:uppercase;letter-spacing:2px}
      .badge{display:inline-block;background:rgba(255,255,255,.2);color:#fff;padding:6px 18px;border-radius:50px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-top:14px;border:1px solid rgba(255,255,255,.3)}
      .body{padding:36px 40px}
      .greet{font-size:20px;font-weight:800;color:#0f172a;margin-bottom:10px}
      .intro{font-size:14px;color:#64748b;line-height:1.7;margin-bottom:24px}
      .card{background:#f0f9ff;border:2px solid #e0f2fe;border-radius:16px;padding:24px;margin-bottom:24px}
      .card-title{font-size:10px;font-weight:800;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}
      th{text-align:left;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;padding:8px;border-bottom:2px solid #e0f2fe}
      .notice{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;text-align:center;margin-bottom:24px}
      .notice p{font-size:13px;color:#64748b;line-height:1.6}
      .btn{display:block;width:fit-content;margin:0 auto 24px;background:linear-gradient(135deg,#0ea5e9,#0d9488);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;text-align:center}
      .ftr{background:#f8fafc;padding:22px 40px;text-align:center;border-top:1px solid #e2e8f0}
      .ftr p{font-size:11px;color:#94a3b8;margin:3px 0}
    </style></head><body>
    <div class="wrap">
      <div class="hdr">
        <h1>StayPG</h1>
        <p>Group Accommodation Portal</p>
        <div class="badge">✅ Group Booking Confirmed</div>
      </div>
      <div class="body">
        <div class="greet">Namaskar, ${leaderName}!</div>
        <div class="intro">
          Your group booking <strong>"${groupName}"</strong> at <strong>SGGSIE&T, Nanded</strong> 
          has been <strong style="color:#059669">approved by the Rector</strong>.
          All ${members.length} members' rooms have been allocated.
        </div>
        <div class="card">
          <div class="card-title">👥 Group Member Allocation</div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Room</th>
                <th>Hostel</th>
              </tr>
            </thead>
            <tbody>${memberRows}</tbody>
          </table>
        </div>
        <div class="card">
          <div class="card-title">📅 Stay Details</div>
          <table>
            <tr style="border-bottom:1px solid #e0f2fe">
              <td style="padding:10px 8px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase">Check-in</td>
              <td style="padding:10px 8px;font-size:13px;font-weight:800;color:#0f172a">${fmt(checkIn)}</td>
            </tr>
            <tr>
              <td style="padding:10px 8px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase">Check-out</td>
              <td style="padding:10px 8px;font-size:13px;font-weight:800;color:#0f172a">${fmt(checkOut)}</td>
            </tr>
          </table>
        </div>
        <div class="notice">
          <p>🔐 QR Gate Passes for all members are now active.<br/>
          Login to <strong>StayPG</strong> → My Bookings → View Group QR Passes.<br/>
          Each member must show their individual QR at the main gate.</p>
        </div>
        <a href="https://hostel-management-system-psi-seven.vercel.app/my-bookings" class="btn">
          View Group Booking & QR Passes →
        </a>
        <p style="font-size:12px;color:#94a3b8;text-align:center;line-height:1.6">
          Please ensure all members carry valid photo IDs.<br/>
          Contact Rector's office for any queries.
        </p>
      </div>
      <div class="ftr">
        <p style="font-size:12px;color:#0ea5e9;font-weight:800">SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGINEERING & TECHNOLOGY</p>
        <p>Vishnupuri, Nanded, Maharashtra — 431606</p>
        <p style="margin-top:10px">This is an automated email. Please do not reply.</p>
      </div>
    </div></body></html>`,
  });
};

module.exports = {
  bookRoom,
  bookGroupRooms,
  getMyBookings,
  getAllBookings,
  getRoomAvailability,
  approveBooking,
  rejectBooking,
  checkInBooking,
  updateReceipt
};