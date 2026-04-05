const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hostel: String,      // Sahyadri / Nandgiri
  type: String,        // AC / Non-AC
  totalRooms: Number,
  availableRooms: Number,
  gender: String       // male / female
});

module.exports = mongoose.model("Room", roomSchema);