import axios from "axios";
import toast from "react-hot-toast";

// 🚀 Yeh function tab chalega jab user payment ke baad 'Confirm' dabayega
const handleRealBooking = async () => {
  const loadingToast = toast.loading("Booking Room in Database...");
  
  try {
    const token = localStorage.getItem("token"); // Student ka token
    
    // Yahan backend ko request bhej rahe hain
    const response = await axios.post(
      "http://localhost:5000/api/bookings/bookRoom", // Dhyan rakhna aapke backend ka route yahi ho
      {
        roomId: "69d9b4fe4940b1b080966da6", // Tumhari hardcoded ID. Backend ab smart hai, agar ye ID nahi bhi mili, toh wo khud naya room dhoondh lega.
        duNumber: "DUJ-" + Math.floor(Math.random() * 10000), 
        hostelName: "Sahyadri"
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.dismiss(loadingToast);
    toast.success("✅ Part 1 Complete! Database mein entry chali gayi!");

  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("❌ Booking Failed");
    console.error(error);
  }
};