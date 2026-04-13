const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },

  hostelName:    { type: String, required: true },
  roomNumber:    { type: String },

  paymentStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  duNumber:      { type: String, required: true, unique: true }, // 🔥 unique prevents double booking
  receiptUrl:    { type: String },

  // Set when Rector approves (planned times)
  checkInTime:   { type: Date },
  checkOutTime:  { type: Date },

  // 🆕 Set when Guard actually scans QR (real times — for live timer)
  actualCheckInTime:  { type: Date },
  actualCheckOutTime: { type: Date },

  // 🆕 Check-in status for guard scanner
  checkInStatus: { type: String, enum: ["not_checked_in", "checked_in", "checked_out"], default: "not_checked_in" },

  rejectionReason: { type: String },

  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },

  emailSent: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);