import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

// Ensure these images are in the same folder as this file
import SggsLogo from "./sggs-logo.png"; 
import PremiumBoy from "./boy_pic.jpg"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isHoveringHome, setIsHoveringHome] = useState(false);

  const navigate = useNavigate();

  // ── NEW LOGIC ADDED: Live Campus Status Fetch ──
  const [roomSummary, setRoomSummary] = useState(null);

  useEffect(() => {
    fetchPublicRoomSummary();
  }, []);

  const fetchPublicRoomSummary = async () => {
    try {
      // Public endpoint — token ki zaroorat nahi
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/book/public-summary`
      );
      if (res.ok) {
        const data = await res.json();
        setRoomSummary(data);
      }
    } catch (e) {
      // Silent fail — disclaimer optional hai
    }
  };
  // ──────────────────────────────────────────────

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const res = await API.post("/api/auth/login", { email, password });
      
      // Save Token and User Data to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 
      
      toast.success("Login Successful 🚀");
      
      // 🚀 THE MAGIC LOGIC: Redirect based on user role
      setTimeout(() => {
        if (res.data.user.role === "rector" || res.data.user.role === "admin") {
          navigate("/rector/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed ❌");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-sky-50 p-4 md:p-10 items-center justify-center font-sans">
      <Toaster />

      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-sky-100">
        
        {/* LEFT SIDE - Premium 3D Display */}
        <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-sky-100 via-white to-teal-50 overflow-hidden">
          
          {/* Ambient Light Glows */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-200/50 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/40 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative w-full h-full flex items-center justify-center z-10 mix-blend-multiply">
            
            {/* The 3D Character Image (Floating) */}
            <motion.img 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={PremiumBoy} 
              alt="Welcome Boy" 
              className="w-3/4 max-w-[450px] object-contain drop-shadow-2xl z-10"
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            <div 
              className="absolute z-20 flex items-center justify-center"
              style={{ left: '68%', top: '42%' }} 
              onMouseEnter={() => setIsHoveringHome(true)}
              onMouseLeave={() => setIsHoveringHome(false)}
            >
              
              {/* Animated Floating Quotes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <AnimatePresence>
                  {isHoveringHome && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -90, x: -60, scale: 1 }}
                        exit={{ opacity: 0, y: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="absolute bg-white/90 backdrop-blur-md text-sky-600 px-5 py-2.5 rounded-2xl shadow-xl text-sm font-bold tracking-wide border border-white whitespace-nowrap"
                      >
                        🌿 Peaceful Stay
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -110, x: 70, scale: 1 }}
                        exit={{ opacity: 0, y: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.05 }}
                        className="absolute bg-white/90 backdrop-blur-md text-orange-500 px-5 py-2.5 rounded-2xl shadow-xl text-sm font-bold tracking-wide border border-white whitespace-nowrap"
                      >
                        😊 Happy Living
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -30, x: 110, scale: 1 }}
                        exit={{ opacity: 0, y: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="absolute bg-white/90 backdrop-blur-md text-teal-600 px-5 py-2.5 rounded-2xl shadow-xl text-sm font-bold tracking-wide border border-white whitespace-nowrap"
                      >
                        🛡️ Safe & Secure
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* The Glowing House Icon Overlay */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative cursor-pointer group"
              >
                {/* Intensive Glow Effect */}
                <div className={`absolute inset-0 bg-yellow-400 rounded-full blur-2xl transition-all duration-300 ${isHoveringHome ? 'opacity-100 scale-150' : 'opacity-60 scale-100'}`} />
                
                {/* Glassmorphism House Badge */}
                <div className="relative w-16 h-16 bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(250,204,21,0.5)] border border-white/60 transition-transform duration-300 group-hover:scale-110">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#ea580c" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-8 h-8 drop-shadow-md"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
              </motion.div>
            </div>

            <p className={`absolute bottom-8 text-sky-600/80 font-bold text-sm tracking-widest uppercase transition-opacity duration-300 ${isHoveringHome ? 'opacity-0' : 'opacity-100'}`}>
              Hover over the home!
            </p>

          </div>
        </div>

        {/* RIGHT SIDE - Bright Login Form */}
        <div className="flex flex-col justify-center px-8 md:px-20 py-16 bg-white">
          <div className="max-w-sm w-full mx-auto">
            
            <header className="mb-10 text-center flex flex-col items-center">
              <img 
                src={SggsLogo} 
                alt="SGGS Logo" 
                className="w-28 object-contain mb-6 drop-shadow-sm"
              />
              <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome Back</h1>
              <p className="text-slate-400 text-sm font-medium">Log in to your hostel dashboard</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b-2 border-slate-100 py-3 text-slate-700 bg-transparent outline-none focus:border-sky-400 transition-colors"
                  placeholder="student@sggs.ac.in"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-slate-100 py-3 text-slate-700 bg-transparent outline-none focus:border-sky-400 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold flex justify-center items-center shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:bg-sky-600 transition-all disabled:opacity-70 mt-4"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  "Log into Dashboard"
                )}
              </motion.button>
            </form>

            <p className="text-center mt-8 text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-sky-500 font-bold hover:underline">
                Sign Up
              </Link>
            </p>

          </div>
        </div>

      </div>

      {/* ── PREMIUM FLOATING LIVE STATUS WIDGET (Dynamic Island Style) ── */}
      <AnimatePresence>
        {roomSummary && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md pointer-events-none"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-full p-2 pr-6 flex items-center justify-between gap-4">
              
              {/* Left Live Indicator */}
              <div className="flex items-center gap-2.5 bg-slate-800/80 rounded-full py-2 px-4 border border-slate-700">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${
                  roomSummary.availableRooms === 0 ? "bg-rose-500 text-rose-500" :
                  roomSummary.availableRooms <= 3 ? "bg-orange-500 text-orange-500" : "bg-emerald-400 text-emerald-400"
                }`} />
                <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Live</span>
              </div>

              {/* Center Info */}
              <div className="flex-1 flex items-center justify-between gap-4 py-1">
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-white leading-none mb-1">
                    {roomSummary.availableRooms} / {roomSummary.totalRooms} Rooms
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${
                    roomSummary.availableRooms === 0 ? "text-rose-400" :
                    roomSummary.availableRooms <= 3 ? "text-orange-400" : "text-emerald-400"
                  }`}>
                    {roomSummary.availableRooms === 0 ? "Fully Occupied" :
                     roomSummary.availableRooms <= 3 ? "🔥 High Demand - Hurry!" : "Available to Book"}
                  </span>
                </div>

                {/* Mini Visual Progress Bar */}
                <div className="hidden sm:flex flex-col items-end gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(roomSummary.availableRooms / roomSummary.totalRooms) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        roomSummary.availableRooms === 0 ? "bg-rose-500" :
                        roomSummary.availableRooms <= 3 ? "bg-orange-500" : "bg-emerald-400"
                      }`}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Capacity</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ──────────────────────────────────────────────────────────────── */}

    </div>
  );
}