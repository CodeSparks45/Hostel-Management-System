const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  hostelName: { type: String, required: true }, // Sahyadri / Nandgiri
  
  paymentStatus: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  duNumber: { type: String }, // SBI Collect Reference
  receiptUrl: { type: String }, // Screenshot link
  
  checkInTime: { type: Date }, // Set when Admin approves
  checkOutTime: { type: Date }, // Set as checkIn + 24 hours
  
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);