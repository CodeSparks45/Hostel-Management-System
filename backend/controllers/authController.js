const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Allowed roles
const ALLOWED_ROLES = ["guest", "professor", "hod", "principal", "admin"];
const ALLOWED_GENDERS = ["male", "female"];

// =====================
// SIGNUP
// =====================
exports.signup = async (req, res) => {
  try {
    // 🔥 FIX 1: Frontend se phone number bhi catch karo
    let { name, email, password, role, gender, phone } = req.body;

    // 🔥 SANITIZE INPUT
    role = role?.toLowerCase().trim();
    gender = gender?.toLowerCase().trim();

    // ❌ Validation
    if (!name || !email || !password || !role || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!ALLOWED_GENDERS.includes(gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      phone, // ✅ Phone DB mein save ho raha hai
      // 🔥 FIX 2: Isko true kar diya taaki login karte hi rooms unlock ho jayein (kyunki saari detail form mein bhar di hai)
      profileCompleted: true, 
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ FIX 3: Login response mein sab kuch properly bhej rahe hain
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender, // Yeh frontend pe lock logic ke liye zaroori hai
        phone: user.phone,
        profileCompleted: user.profileCompleted
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// COMPLETE PROFILE
// =====================
exports.completeProfile = async (req, res) => {
  try {
    let { phone, collegeId, gender, role } = req.body;

    // 🔥 SANITIZE AGAIN
    if (role) role = role.toLowerCase().trim();
    if (gender) gender = gender.toLowerCase().trim();

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (gender && !ALLOWED_GENDERS.includes(gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        phone,
        collegeId,
        gender,
        role,
        profileCompleted: true
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};