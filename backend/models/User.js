const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    // Designation cases align kar diye hain frontend se
    enum: ["guest", "admin", "hod", "professor", "principal"], 
    default: "guest" 
  },
  gender: { type: String, enum: ["male", "female", ""] },
  phone: { type: String },
  collegeId: { type: String },
  profileCompleted: { type: Boolean, default: false } // Redirection ke liye zaroori
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);