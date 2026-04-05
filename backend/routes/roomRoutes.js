const express = require("express");
const router = express.Router();

// 👇 IMPORT CHECK
const roomController = require("../controllers/roomController");

console.log("ROOM CONTROLLER:", roomController); // DEBUG

router.post("/", roomController.createRoom);
router.get("/", roomController.getRooms);

module.exports = router;