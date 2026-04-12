require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Room = require("../models/Room");

const rooms = [
  {
    number: "A4",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 550,
    amenities: ["WiFi", "AC", "Mess"]
  },
  {
    number: "A10",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 550,
    amenities: ["WiFi", "AC", "Mess"]
  },
  {
    number: "B4",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 550,
    amenities: ["WiFi", "AC", "Mess"]
  },
  {
    number: "B10",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 550,
    amenities: ["WiFi", "AC", "Mess"]
  },
  {
    number: "A8",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 450,
    amenities: ["WiFi", "Mess"]
  },
  {
    number: "A9",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 450,
    amenities: ["WiFi", "Mess"]
  },
  {
    number: "B8",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 450,
    amenities: ["WiFi", "Mess"]
  },
  {
    number: "B9",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 450,
    amenities: ["WiFi", "Mess"]
  },
  {
    number: "G-A9",
    hostel: "Krishna Girls Hostel",
    type: "Non-AC",
    gender: "female",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 450,
    amenities: ["WiFi", "Mess"]
  },
  {
    number: "G-A10",
    hostel: "Krishna Girls Hostel",
    type: "Non-AC",
    gender: "female",
    totalRooms: 1,
    availableRooms: 1,
    pricePerDay: 450,
    amenities: ["WiFi", "Mess"]
  }
];

const seedRooms = async () => {
  try {
    await connectDB();

    await Room.deleteMany();

    await Room.insertMany(rooms);

    console.log("✅ Rooms Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedRooms();