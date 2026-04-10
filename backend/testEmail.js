// .env file se password padhne ke liye
require("dotenv").config(); 

// Hamara banaya hua email function import kar rahe hain
const { sendApprovalEmail } = require("./utils/emailService");

const runTest = async () => {
  console.log("🚀 Email bhejna shuru kar rahe hain...");
  
  // Yahan 'apna_dusra_email@gmail.com' ki jagah apna koi bhi personal email daal do test karne ke liye
  const userEmail = "2025bit503@sggs.ac.in"; 
  const userName = "Vedant (Test User)";
  const roomNumber = "Room 404 (VIP)";

  const success = await sendApprovalEmail(userEmail, userName, roomNumber);

  if (success) {
    console.log("🎉 Test SUCCESS! Bhai apna inbox check karo.");
  } else {
    console.log("❌ Test FAILED! Password ya email mein kuch gadbad hai.");
  }
};

// Test function ko call kar do
runTest();