const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  number:         { type: String, required: true, unique: true }, // "S-101", "N-201"
  hostel:         { type: String, required: true },               // "Sahyadri" / "Nandgiri"
  type:           { type: String, default: "Standard" },          // "AC" / "Non-AC" / "VIP"
  totalRooms:     { type: Number, default: 1 },
  availableRooms: { type: Number, default: 1 },
  gender:         { type: String, enum: ["male", "female", "any"], default: "any" },
  pricePerDay:    { type: Number, default: 450 },
  amenities:      [{ type: String }],                             // ["WiFi", "AC", "Mess"]
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);