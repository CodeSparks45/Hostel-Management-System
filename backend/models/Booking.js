const mongoose = require("mongoose");

// Individual member schema for group bookings
const groupMemberSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  designation: { type: String },
  gender:      { type: String, enum: ["male", "female"], required: true },
  mobile:      { type: String },
  room:        { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  roomNumber:  { type: String },
  hostelName:  { type: String },
  emailSent:   { type: Boolean, default: false },
}, { _id: true });

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    // Not required for group bookings
  },

  // ── Booking Type ──────────────────────────────────────────────
  bookingType: {
    type: String,
    enum: ["individual", "group"],
    default: "individual"
  },

  // ── Individual Booking Fields ─────────────────────────────────
  hostelName:  { type: String },
  roomNumber:  { type: String },

  // ── Group Booking Fields ──────────────────────────────────────
  groupName:        { type: String },           // "TechCorp Recruiters"
  groupSize:        { type: Number, default: 1 },
  groupMembers:     [groupMemberSchema],         // Array of members
  totalAmount:      { type: Number },            // Total for all rooms

  // ── Payment ───────────────────────────────────────────────────
  paymentStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  duNumber:    { type: String, required: true, unique: true },
  receiptUrl:  { type: String },

  // ── Dates ─────────────────────────────────────────────────────
  checkInTime:  { type: Date },
  checkOutTime: { type: Date },
  actualCheckInTime:  { type: Date },
  actualCheckOutTime: { type: Date },

  // ── Guard ─────────────────────────────────────────────────────
  checkInStatus: {
    type: String,
    enum: ["not_checked_in", "checked_in", "checked_out"],
    default: "not_checked_in"
  },

  // ── Rejection ─────────────────────────────────────────────────
  rejectionReason: { type: String },

  // ── Status ────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active"
  },

  emailSent: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);