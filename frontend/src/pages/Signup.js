/**
 * Institutional Hostel Management System - Signup Portal
 * Features: Role & Gender Selection for StayPG Logic
 * Style: Premium Light Theme with 3D Assets & Glassmorphism
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle, 
  Loader2, User, UserPlus, ShieldCheck, 
  Briefcase, VenusAndMars, ChevronDown, Phone // ✅ Phone icon added
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

// Same assets used in Login for absolute consistency
import SggsLogo from "./sggs-logo.png"; 
import PremiumBoy from "./boy_pic.jpg"; 

// --- Validation Schema ---
const signupSchema = z.object({
  name: z.string().min(1, "Full Name is required").max(50),
  email: z.string().min(1, "Email is required").email("Enter institutional email"),
  phone: z.string().min(10, "Valid 10-digit mobile number required").max(15, "Invalid mobile number"), // ✅ Phone validation added
  password: z.string().min(8, "Security protocol requires 8+ characters"),
  role: z.enum(["professor", "hod", "principal", "guest"], {
    errorMap: () => ({ message: "Please select your designation" }),
  }),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required for hostel allocation" }),
  }),
});

// --- Reusable Input Component (Tailwind Styled) ---
const InputField = ({ label, icon: Icon, error, rightEl, isSelect, children, ...props }) => (
  <div className="mb-4">
    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={18} className={error ? "text-red-400" : ""} />
      </div>
      
      {isSelect ? (
        <select
          {...props}
          className={`w-full py-3 pl-8 pr-8 bg-transparent border-b-2 text-slate-700 outline-none transition-colors appearance-none cursor-pointer ${
            error ? "border-red-300 focus:border-red-500" : "border-slate-100 focus:border-sky-400"
          }`}
        >
          {children}
        </select>
      ) : (
        <input
          {...props}
          className={`w-full py-3 pl-8 pr-10 bg-transparent border-b-2 text-slate-700 outline-none transition-colors ${
            error ? "border-red-300 focus:border-red-500" : "border-slate-100 focus:border-sky-400"
          }`}
        />
      )}
      
      {/* Dropdown Arrow for Selects */}
      {isSelect && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      )}

      {/* Custom Right Element (like Show/Hide Password) */}
      {rightEl && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
    
    {error && (
      <p className="text-[11px] text-red-500 mt-1.5 ml-1 flex items-center gap-1 font-medium">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHoveringHome, setIsHoveringHome] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ 
    resolver: zodResolver(signupSchema) 
  });

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
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post("/api/auth/signup", data);
      toast.success("Registration Successful! 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed ❌");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-sky-50 p-4 md:p-10 items-center justify-center font-sans">
      <Toaster position="top-right" />

      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-sky-100">
        
        {/* LEFT SIDE - Premium 3D Display */}
        <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-sky-100 via-white to-teal-50 overflow-hidden">
          
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-200/50 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/40 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative w-full h-full flex items-center justify-center z-10 mix-blend-multiply">
            
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

              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-yellow-400 rounded-full blur-2xl transition-all duration-300 ${isHoveringHome ? 'opacity-100 scale-150' : 'opacity-60 scale-100'}`} />
                <div className="relative w-16 h-16 bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(250,204,21,0.5)] border border-white/60 transition-transform duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 drop-shadow-md">
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

        {/* RIGHT SIDE - Registration Form */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-12 bg-white max-h-[90vh] overflow-y-auto">
          <div className="max-w-sm w-full mx-auto">
            
            <header className="mb-6 text-center flex flex-col items-center">
              <img 
                src={SggsLogo} 
                alt="SGGS Logo" 
                className="w-16 object-contain mb-3 drop-shadow-sm"
              />
              <h1 className="text-xl font-extrabold text-slate-800 mb-1 uppercase tracking-wide">Hostel Enrollment</h1>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Secure Gateway</p>
            </header>

            {/* ✅ NEW DISCLAIMER ADDED */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-6">
               <p className="text-[10px] text-sky-600 font-bold text-center uppercase tracking-wide leading-relaxed">
                 ⚠️ Enter proper Email and Mobile Number to receive booking related updates and alerts.
               </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              
              <InputField id="name" label="Full Name" icon={User} type="text" placeholder="Prof. Abhijit Singh" error={errors.name?.message} {...register("name")} />
              
              <InputField id="email" label="Official Email" icon={Mail} type="email" placeholder="user@sggs.ac.in" error={errors.email?.message} {...register("email")} />
              
              {/* ✅ NEW PHONE FIELD ADDED */}
              <InputField id="phone" label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" error={errors.phone?.message} {...register("phone")} />

              <InputField id="role" label="Designation" icon={Briefcase} isSelect error={errors.role?.message} {...register("role")}>
                <option value="" disabled className="text-slate-300">Select Professional Role</option>
                <option value="professor">Faculty / Professor</option>
                <option value="hod">Department Head (HOD)</option>
                <option value="principal">Principal / Director</option>
                <option value="guest">Visiting Guest</option>
              </InputField>

              {/* ✅ GENDER OPTIONS SIMPLIFIED */}
              <InputField id="gender" label="Gender Allocation" icon={VenusAndMars} isSelect error={errors.gender?.message} {...register("gender")}>
                <option value="" disabled className="text-slate-300">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </InputField>

              <InputField id="password" label="Security Password" icon={Lock} type={showPw ? "text" : "password"} placeholder="••••••••" error={errors.password?.message} {...register("password")}
                rightEl={
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-sky-500 transition-colors focus:outline-none">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold flex justify-center items-center shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:bg-sky-600 transition-all disabled:opacity-70 mt-6 gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Complete Signup <UserPlus size={18}/></>}
              </motion.button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-400 font-medium">
                Already registered?{" "}
                <Link to="/login" className="text-sky-500 font-bold hover:underline ml-1">
                  Log In
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center items-center gap-2 text-slate-400">
              <ShieldCheck size={16} className="text-sky-500" />
              <span className="text-[10px] font-bold tracking-widest uppercase">SGGSIE&T Official Portal</span>
            </div>

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