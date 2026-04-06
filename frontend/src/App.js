import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompleteProfile from "./pages/CompleteProfile";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import MyBookings from "./pages/MyBookings";
import Rooms from "./pages/Rooms";
import VerifyPayment from "./pages/VerifyPayment";
import SBCollectSimulator from "./pages/SBCollectSimulator";
import { Toaster } from "react-hot-toast";
import GuardScanner from "./pages/GuardScanner";
import RectorDashboard from "./pages/RectorDashboard";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/CompleteProfile";
import Booking from "./pages/MyBookings";
import Verify from "./pages/VerifyPayment";
import SOS from "./pages/SOS";

// NEW IMPORTS
import Settings from "./pages/Settings";
import HelpBot from "./pages/HelpBot";

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
        <Route path="/payment-gateway/:id/:price" element={<SBCollectSimulator />} />
        <Route path="/rooms" element={<Rooms />} /> 
        <Route path="/rooms/:id" element={<Rooms />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/verify-payment" element={<VerifyPayment />} />
        <Route path="/verify-payment/:id" element={<VerifyPayment />} />
        <Route path="/guard/scanner" element={<GuardScanner />} />
        <Route path="/rector/dashboard" element={<RectorDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/sos" element={<SOS />} />
        
        {/* NEW OUTSTANDING ROUTES */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/helpbot" element={<HelpBot />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;