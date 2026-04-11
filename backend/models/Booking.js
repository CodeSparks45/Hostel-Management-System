const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room", 
    required: true 
  },
  hostelName:    { type: String, required: true },   // "Sahyadri" / "Nandgiri"
  roomNumber:    { type: String },                   // "S-101" — set on approval

  // Payment
  paymentStatus: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  duNumber:      { type: String, required: true },   // SBI Collect DU Reference
  receiptUrl:    { type: String },                   // Cloudinary URL of uploaded receipt

  // Dates — set when Rector approves
  checkInTime:   { type: Date },
  checkOutTime:  { type: Date },

  // Rejection
  rejectionReason: { type: String },

  // Overall status
  status: { 
    type: String, 
    enum: ["active", "expired", "cancelled"], 
    default: "active" 
  },

  // Email tracking
  emailSent: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);