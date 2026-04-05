import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompleteProfile from "./pages/CompleteProfile";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import MyBookings from "./pages/MyBookings";
import Rooms from "./pages/Rooms";
import VerifyPayment from "./pages/VerifyPayment";
import SBCollectSimulator from "./pages/SBCollectSimulator"; // Isko zaroor import karein
import { Toaster } from "react-hot-toast";
import GuardScanner from "./pages/GuardScanner";
import RectorDashboard from "./pages/RectorDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={
          !token ? <Navigate to="/login" /> : 
          (!user?.profileCompleted ? <Navigate to="/complete-profile" /> : <Navigate to="/home" />)
        } />

        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explorer/:id" element={<Explorer />} />
        
        
        {/* PAYMENTS SIMULATOR ROUTE */}
        <Route path="/payment-gateway/:id/:price" element={<SBCollectSimulator />} />

        <Route path="/rooms" element={<Rooms />} /> 
        <Route path="/rooms/:id" element={<Rooms />} />

        <Route path="/my-bookings" element={<MyBookings />} />
         
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/verify-payment/:id" element={<VerifyPayment />} />
        <Route path="/guard/scanner" element={<GuardScanner />} />
        <Route path="/rector/dashboard" element={<RectorDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;