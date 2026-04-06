import { useState } from "react";
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
    </div>
  );
}