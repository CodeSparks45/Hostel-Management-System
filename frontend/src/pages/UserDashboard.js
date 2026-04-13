import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, ShieldCheck, QrCode, LogOut, Settings, Home as HomeIcon,
  Building2, Bell, CalendarCheck, BadgeCheck, Siren, Bot,
  Clock, AlertCircle, Lock, Wifi, Moon, Sun, Activity,
  Coffee, Wind, Shield, Zap, Menu, X, ChevronRight,
  Utensils, Wrench, Send, Smartphone, ArrowUpRight,
  Timer, CheckCircle2, MapPin
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import API from "../services/api";
import SggsLogo from "./sggs-logo.png";

// ── Countdown Timer Component ────────────────────────────────────
function CountdownTimer({ checkOutTime, checkInTime }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const out = new Date(checkOutTime);
      const inn = new Date(checkInTime);
      const diff = out - now;
      const elapsedMs = now - inn;

      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0, expired: true });
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s, expired: false });

      const eh = Math.floor(elapsedMs / 3600000);
      const em = Math.floor((elapsedMs % 3600000) / 60000);
      const es = Math.floor((elapsedMs % 60000) / 1000);
      setElapsed({ h: eh, m: em, s: es });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [checkOutTime, checkInTime]);

  if (!timeLeft) return null;

  const pad = (n) => String(n).padStart(2, "0");
  const total = 24 * 3600000;
  const out = new Date(checkOutTime);
  const inn = new Date(checkInTime);
  const remaining = Math.max(0, out - new Date());
  const pct = Math.min(100, ((total - remaining) / total) * 100);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Timer size={14} className="text-white/80" />
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
            {timeLeft.expired ? "Stay Ended" : "Time Remaining"}
          </span>
        </div>
        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
          24h Stay
        </span>
      </div>
      <div className="text-2xl font-black text-white tracking-tighter mb-2">
        {timeLeft.expired
          ? "00:00:00"
          : `${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`
        }
      </div>
      {/* Progress bar */}
      <div className="w-full bg-white/20 rounded-full h-1.5 mb-1">
        <div
          className="bg-white rounded-full h-1.5 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-bold text-white/50 uppercase tracking-wider">
        <span>Check-in {new Date(inn).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
        <span>Check-out {new Date(out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [bookingState, setBookingState] = useState("none");
  const [latestBooking, setLatestBooking] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [mealSkipped, setMealSkipped] = useState(false);
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Electrical");
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Guest Scholar", phone: "", collegeId: "", gender: "male", role: "guest"
    };
    setUser(storedUser);
    fetchLatestBooking();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const bookingTimer = setInterval(fetchLatestBooking, 12000);
    return () => { clearInterval(timer); clearInterval(bookingTimer); };
  }, []);

  const fetchLatestBooking = async () => {
    try {
      const res = await API.get("/api/book/my");
      const bookings = res.data;
      if (!bookings?.length) { setBookingState("none"); setLatestBooking(null); return; }
      const latest = bookings[0];
      const s = latest?.paymentStatus;
      setLatestBooking(latest);
      if (s === "approved") {
        setBookingState("approved");
        // Check if checkin has happened (checkInTime exists and is after approval)
        if (latest.checkInTime) setCheckedIn(true);
      } else if (s === "rejected") {
        setBookingState("none");
      } else {
        setBookingState("pending");
      }
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login");
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };
  const handleSkipMeal = (e) => { e.stopPropagation(); setMealSkipped(true); toast.success("Meal skipped! 🌿"); };
  const submitTicket = (e) => {
    e.preventDefault();
    toast.success("Ticket submitted! Technician assigned. 🛠️");
    setTicketDescription(""); setActiveModal(null);
  };
  const handleActionClick = (action) => {
    if (bookingState !== "approved") {
      toast.error("Locked! Waiting for Rector approval.", { icon: "🔒" });
      return;
    }
    setActiveModal(action);
    setSidebarOpen(false);
  };

  const timeOfDay = currentTime.getHours();
  const greeting = timeOfDay < 12 ? "Good morning" : timeOfDay < 17 ? "Good afternoon" : "Good evening";
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-8 px-1">
        <img src={SggsLogo} alt="SGGS" className="w-9 object-contain" />
        <div>
          <p className="text-base font-extrabold text-slate-800 leading-none">StayPG</p>
          <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-0.5">Institutional</p>
        </div>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-100 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-sky-500/20">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-slate-800 text-sm truncate">{user.name}</p>
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">{user.role}</p>
          </div>
        </div>
        <div className={`mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl w-fit ${
          bookingState === "approved" ? "bg-emerald-100 text-emerald-700" :
          bookingState === "pending" ? "bg-amber-100 text-amber-700" :
          "bg-slate-100 text-slate-500"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            bookingState === "approved" ? "bg-emerald-500" :
            bookingState === "pending" ? "bg-amber-500" : "bg-slate-400"
          }`} />
          {bookingState === "approved" ? `Room ${latestBooking?.roomNumber}` :
           bookingState === "pending" ? "Pending Approval" : "No Booking"}
        </div>
      </div>

      <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.2em] px-1 mb-2">Navigation</p>
      <nav className="space-y-0.5 mb-5">
        <SBItem icon={<HomeIcon size={17}/>} label="Dashboard" active onClick={() => { navigate("/dashboard"); setSidebarOpen(false); }} />
        <SBItem icon={<User size={17}/>} label="My Profile" onClick={() => { navigate("/complete-profile"); setSidebarOpen(false); }} />
        <SBItem icon={<Building2 size={17}/>} label="Explore Hostels" onClick={() => { navigate("/home"); setSidebarOpen(false); }} />
        <SBItem icon={<CalendarCheck size={17}/>} label="My Bookings" onClick={() => { navigate("/my-bookings"); setSidebarOpen(false); }} />
        <SBItem icon={<BadgeCheck size={17}/>} label="Verify Pass" onClick={() => { navigate("/verify-payment"); setSidebarOpen(false); }} />
      </nav>

      <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.2em] px-1 mb-2">Quick Actions</p>
      <nav className="space-y-0.5 mb-5">
        <SBItem icon={<QrCode size={17}/>} label="Smart Outpass" disabled={bookingState !== "approved"} onClick={() => handleActionClick("outpass")} />
        <SBItem icon={<Utensils size={17}/>} label="Dining Hub" disabled={bookingState !== "approved"} onClick={() => handleActionClick("dining")} />
        <SBItem icon={<Wrench size={17}/>} label="Maintenance" disabled={bookingState !== "approved"} onClick={() => handleActionClick("maintenance")} />
      </nav>

      <div className="space-y-0.5 border-t border-slate-100 pt-4">
        <button onClick={() => { navigate("/sos"); setSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 mb-1">
          <Siren size={17} className="animate-pulse" /> SOS Emergency
        </button>
        <SBItem icon={<Bot size={17}/>} label="AI Concierge" onClick={() => { navigate("/helpbot"); setSidebarOpen(false); }} />
        <SBItem icon={<Settings size={17}/>} label="Settings" onClick={() => { navigate("/settings"); setSidebarOpen(false); }} />
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all">
          <LogOut size={17}/> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
      <Toaster position="top-right" />

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-72 bg-white z-50 p-6 overflow-y-auto border-r border-slate-100 shadow-2xl lg:hidden">
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-5 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col py-6 px-5 border-r border-slate-100 fixed top-0 left-0 h-screen z-40 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ── MODAL OVERLAYS ── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-base">
                  {activeModal === "outpass" && "🚪 Smart Gate Pass"}
                  {activeModal === "maintenance" && "🔧 Maintenance Ticket"}
                  {activeModal === "staff" && "👔 Block Officials"}
                  {activeModal === "dining" && "🍽️ Dining Hub"}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"><X size={17}/></button>
              </div>

              {activeModal === "outpass" && (
                <div className="p-7 flex flex-col items-center">
                  <div className="w-full bg-emerald-50 text-emerald-700 text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest mb-5 border border-emerald-100">
                    ✅ Rector Approved · Valid 24 Hours
                  </div>
                  <div className="w-44 h-44 bg-white border-4 border-slate-100 rounded-2xl shadow-inner flex items-center justify-center p-3 mb-5">
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-no-repeat bg-center opacity-80" />
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-sm">
                    {[
                      ["Resident", user.name],
                      ["Room", latestBooking?.roomNumber || "—"],
                      ["Hostel", latestBooking?.hostelName || "—"],
                      ["DU Ref", latestBooking?.duNumber || "—"],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between">
                        <span className="text-slate-400 font-bold text-xs">{l}</span>
                        <span className="font-extrabold text-slate-800 text-xs text-right max-w-[60%] truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400 text-xs text-center font-medium mt-4">Show this QR at the main gate scanner.</p>
                </div>
              )}

              {activeModal === "maintenance" && (
                <form onSubmit={submitTicket} className="p-5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Category</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Electrical", "Plumbing", "Carpentry", "Cleaning"].map(cat => (
                      <button key={cat} type="button" onClick={() => setTicketCategory(cat)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${ticketCategory === cat ? "bg-sky-500 text-white border-sky-500" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Description</p>
                  <textarea required value={ticketDescription} onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Describe the issue..." rows={4}
                    className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 text-sm font-medium text-slate-700 resize-none mb-4 transition-colors" />
                  <button type="submit" className="w-full bg-sky-500 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20">
                    Submit Ticket <Send size={15}/>
                  </button>
                </form>
              )}

              {activeModal === "dining" && (
                <div className="p-5">
                  <div className="space-y-3 mb-4">
                    {[
                      { meal: "Breakfast", time: "7:30–9:00 AM", menu: "Poha, Jalebi, Chai", icon: "🌅" },
                      { meal: "Lunch", time: "12:30–2:00 PM", menu: "Rajma Chawal, Roti, Salad, Buttermilk", icon: "☀️" },
                      { meal: "Dinner", time: "8:00–10:00 PM", menu: "Paneer Butter Masala, Roti, Jeera Rice, Gulab Jamun", icon: "🌙" },
                    ].map((m) => (
                      <div key={m.meal} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-extrabold text-slate-800">{m.icon} {m.meal}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{m.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{m.menu}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setMealSkipped(true); setActiveModal(null); toast.success("Dinner skipped! 🌿"); }}
                    className="w-full bg-amber-50 text-amber-700 border border-amber-100 py-3 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors">
                    Skip Tonight's Dinner
                  </button>
                </div>
              )}

              {activeModal === "staff" && (
                <div className="p-5 space-y-3">
                  {[
                    { initials: "SRD", name: "Prof. S.R. Deshmukh", role: "Chief Warden", contact: "tel:+919876500001" },
                    { initials: "AKP", name: "Mr. A.K. Patil", role: "Superintendent", contact: "tel:+919876500002" },
                  ].map((p) => (
                    <div key={p.initials} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-xs font-extrabold text-sky-700">{p.initials}</div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-sky-500 font-bold uppercase tracking-wider">{p.role}</p>
                        </div>
                      </div>
                      <a href={p.contact} className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors">
                        <Smartphone size={14}/>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        {/* MOBILE TOP NAV */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
            <Menu size={20}/>
          </button>
          <div className="flex items-center gap-2">
            <img src={SggsLogo} alt="" className="w-7 object-contain"/>
            <span className="font-extrabold text-slate-800">StayPG</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
              {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
            </button>
            <div onClick={() => navigate("/complete-profile")} className="w-8 h-8 bg-sky-500 rounded-xl flex items-center justify-center text-white font-extrabold text-sm cursor-pointer">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-7">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                {greeting}, {user.name?.split(" ")[0]} 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {bookingState === "approved"
                    ? `${latestBooking?.hostelName} · Room ${latestBooking?.roomNumber}`
                    : "SGGSIE&T Hostel Portal"}
                </p>
                {bookingState === "approved" && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>}
              </div>
            </motion.div>

            {/* Desktop header actions */}
            <div className="hidden lg:flex gap-2 items-center">
              <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                <Clock size={13} className="text-sky-500"/>
                {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <button onClick={toggleTheme} className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 hover:text-sky-500 transition-all">
                {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
              </button>
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)}
                  className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all relative">
                  <Bell size={17}/>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"/>
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Notifications</p>
                      {[
                        { icon: "🏠", msg: "Rector approved your booking", time: "2h ago", c: "bg-emerald-50" },
                        { icon: "💳", msg: "SBI payment receipt verified", time: "3h ago", c: "bg-sky-50" },
                        { icon: "📢", msg: "Mess menu updated this week", time: "Yesterday", c: "bg-amber-50" },
                      ].map((n, i) => (
                        <div key={i} className={`flex gap-3 p-3 ${n.c} rounded-xl mb-2 last:mb-0`}>
                          <span className="text-base">{n.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-700">{n.msg}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div onClick={() => navigate("/complete-profile")}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:border-sky-200 transition-all">
                <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="text-sm font-bold text-slate-700">{user.name?.split(" ")[0]}</span>
              </div>
            </div>
          </header>

          {/* GRID */}
          <motion.div variants={{ show: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

            {/* ── HERO CARD ── */}
            {bookingState === "approved" && (
              <motion.div variants={item} className="sm:col-span-2 lg:col-span-8 bg-gradient-to-br from-sky-500 to-teal-400 rounded-[1.75rem] p-6 md:p-7 relative overflow-hidden shadow-xl shadow-sky-500/20 border border-sky-400 flex flex-col justify-between min-h-[200px]">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full blur-[60px] opacity-20 pointer-events-none"/>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.3em] mb-1.5 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"/> Active Stay
                    </p>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{user.name}</h2>
                    <p className="text-sm text-sky-50 font-medium mt-0.5">{user.role?.toUpperCase()} · SGGSIE&T</p>
                  </div>
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
                    <ShieldCheck size={22} className="text-white"/>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 relative z-10 border-t border-white/20 pt-4 mt-5">
                  <div>
                    <p className="text-[9px] text-sky-100 font-bold uppercase tracking-widest mb-0.5">Room</p>
                    <p className="text-base font-extrabold text-white">{latestBooking?.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-sky-100 font-bold uppercase tracking-widest mb-0.5">Hostel</p>
                    <p className="text-sm font-extrabold text-white">{latestBooking?.hostelName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-sky-100 font-bold uppercase tracking-widest mb-0.5">DU Ref</p>
                    <p className="text-sm font-extrabold text-white font-mono">{latestBooking?.duNumber?.slice(0,8)}</p>
                  </div>
                </div>
                {/* Live Timer */}
                {latestBooking?.checkInTime && latestBooking?.checkOutTime && (
                  <CountdownTimer checkInTime={latestBooking.checkInTime} checkOutTime={latestBooking.checkOutTime}/>
                )}
              </motion.div>
            )}

            {bookingState === "pending" && (
              <motion.div variants={item} className="sm:col-span-2 lg:col-span-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[1.75rem] p-6 md:p-7 relative overflow-hidden shadow-xl shadow-amber-500/20 border border-amber-300 flex flex-col justify-between min-h-[200px]">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full blur-[60px] opacity-20 pointer-events-none"/>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-[10px] font-bold text-amber-100 uppercase tracking-[0.3em] mb-1.5 flex items-center gap-1.5">
                      <Clock size={11} className="animate-pulse"/> Verification in Progress
                    </p>
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Application Under Review</h2>
                    <p className="text-sm text-amber-50 font-medium mt-1 leading-relaxed max-w-sm">Receipt & DU Number submitted. Rector's office is verifying.</p>
                  </div>
                  <AlertCircle size={22} className="text-white/80 flex-shrink-0 mt-1"/>
                </div>
                <div className="mt-5 pt-4 border-t border-white/20 relative z-10 flex gap-3 items-center flex-wrap">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    {latestBooking?.duNumber || "Processing..."}
                  </span>
                  <span className="text-xs text-amber-100 font-medium">Please check back in a few hours.</span>
                  <button onClick={() => navigate("/my-bookings")}
                    className="ml-auto text-xs text-white font-bold bg-white/20 px-3 py-1.5 rounded-xl hover:bg-white/30 transition-all flex items-center gap-1">
                    Track <ChevronRight size={13}/>
                  </button>
                </div>
              </motion.div>
            )}

            {bookingState === "none" && (
              <motion.div variants={item} className="sm:col-span-2 lg:col-span-8 bg-white rounded-[1.75rem] p-6 md:p-7 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-50 rounded-full blur-[50px] opacity-60 -z-10"/>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-100">
                    <Building2 size={22} className="text-sky-400"/>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Welcome to StayPG</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">SGGSIE&T Official Portal</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">Browse Sahyadri Boys Hostel & Krishna Girls Hostel. Book your stay in seconds via SBI Collect.</p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => navigate("/home")}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2">
                    <Building2 size={15}/> Explore Rooms
                  </button>
                  <button onClick={() => navigate("/verify-payment")}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-100 transition-all flex items-center gap-2">
                    <BadgeCheck size={15}/> Verify Pass
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── OUTPASS CARD ── */}
            <motion.div variants={item} onClick={() => handleActionClick("outpass")}
              className={`lg:col-span-4 bg-white rounded-[1.75rem] p-5 border shadow-sm flex flex-col justify-between min-h-[180px] transition-all ${
                bookingState === "approved" ? "border-emerald-100 cursor-pointer hover:shadow-xl hover:border-emerald-200" : "border-slate-100 opacity-50 grayscale cursor-not-allowed"
              }`}>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><QrCode size={19}/></div>
                  {bookingState === "approved"
                    ? <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">Live</span>
                    : <Lock size={14} className="text-slate-400"/>}
                </div>
                <h3 className="text-base font-extrabold text-slate-800 mb-1">Smart Outpass</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Dynamic QR gate pass for campus entry & exit.</p>
              </div>
              <div className={`w-full mt-4 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
                bookingState === "approved" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600" : "bg-slate-100 text-slate-400"
              }`}>
                Open Pass <ChevronRight size={14}/>
              </div>
            </motion.div>

            {/* ── DINING ── */}
            <motion.div variants={item} onClick={() => handleActionClick("dining")}
              className={`lg:col-span-3 bg-white rounded-[1.75rem] p-5 border shadow-sm flex flex-col justify-between min-h-[160px] transition-all ${
                bookingState === "approved" ? "border-amber-100 cursor-pointer hover:shadow-xl hover:border-amber-200" : "border-slate-100 opacity-50 grayscale cursor-not-allowed"
              }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Utensils size={18}/></div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Dining Hub</h3>
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Today</p>
                </div>
              </div>
              <div className={`rounded-xl p-3 border text-xs transition-colors ${mealSkipped ? "bg-slate-50 border-slate-100" : "bg-amber-50/50 border-amber-100"}`}>
                <p className={`font-bold leading-relaxed ${mealSkipped ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  Paneer Butter Masala, Roti, Jeera Rice
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>8:00 PM</span>
                {bookingState === "approved" && (
                  mealSkipped
                    ? <span className="text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100"><CheckCircle2 size={11}/> Skipped</span>
                    : <button onClick={handleSkipMeal} className="text-sky-500 hover:bg-sky-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">Skip <ArrowUpRight size={11}/></button>
                )}
              </div>
            </motion.div>

            {/* ── MAINTENANCE ── */}
            <motion.div variants={item} onClick={() => handleActionClick("maintenance")}
              className={`lg:col-span-3 bg-white rounded-[1.75rem] p-5 border shadow-sm flex flex-col justify-between min-h-[160px] transition-all ${
                bookingState === "approved" ? "border-rose-100 cursor-pointer hover:shadow-xl hover:border-rose-200" : "border-slate-100 opacity-50 grayscale cursor-not-allowed"
              }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Wrench size={18}/></div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Maintenance</h3>
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Raise Ticket</p>
                </div>
              </div>
              {bookingState === "approved" ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <p className="text-xs font-bold text-slate-700">Fan Regulator Broken</p>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase rounded-md border border-amber-100">In Progress</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Technician assigned · 4:00 PM</p>
                </>
              ) : (
                <p className="text-xs font-medium text-slate-400">Requires room allocation.</p>
              )}
              {bookingState === "approved" && (
                <div className="mt-2 text-[10px] font-bold text-sky-500 flex items-center gap-1">+ New Issue <ArrowUpRight size={11}/></div>
              )}
            </motion.div>

            {/* ── BLOCK OFFICIALS ── */}
            <motion.div variants={item} onClick={() => handleActionClick("staff")}
              className={`lg:col-span-3 bg-white rounded-[1.75rem] p-5 border shadow-sm flex flex-col justify-between min-h-[160px] transition-all ${
                bookingState === "approved" ? "border-sky-100 cursor-pointer hover:shadow-xl hover:border-sky-200" : "border-slate-100 opacity-50 grayscale cursor-not-allowed"
              }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center"><User size={18}/></div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Block Officials</h3>
                  <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest">{bookingState === "approved" ? "Sahyadri Wing" : "Unallocated"}</p>
                </div>
              </div>
              {bookingState === "approved" ? (
                <div className="space-y-2">
                  {["Prof. S.R. Deshmukh — Warden", "Mr. A.K. Patil — Superintendent"].map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-[9px] font-extrabold text-sky-700">{p.slice(0,3).toUpperCase()}</div>
                      <p className="text-[10px] font-bold text-slate-700 leading-tight">{p}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-medium text-slate-400">Available after room allocation.</p>
              )}
              {bookingState === "approved" && <div className="mt-2 text-[10px] font-bold text-sky-500 flex items-center gap-1">All Contacts <ArrowUpRight size={11}/></div>}
            </motion.div>

            {/* ── CAMPUS ACTIVITY ── */}
            <motion.div variants={item} className="lg:col-span-3 bg-white rounded-[1.75rem] p-5 border border-slate-100 shadow-sm flex flex-col gap-3 min-h-[160px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Activity size={18}/></div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Campus Activity</h3>
                  <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">Live Updates</p>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                {[
                  { icon: "📚", text: "Library open till midnight", type: "info" },
                  { icon: "⚡", text: "Power cut: Block B, 2–4 PM", type: "warn" },
                  { icon: "🏋️", text: "Gym: 6–8 AM & 5–8 PM", type: "info" },
                ].map((a, i) => (
                  <div key={i} className={`flex items-start gap-2 p-2 rounded-xl text-xs font-medium ${a.type === "warn" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                    <span className="text-sm">{a.icon}</span>
                    <span className="font-bold leading-tight">{a.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── AI CONCIERGE ── */}
            <motion.div variants={item} onClick={() => navigate("/helpbot")}
              className="lg:col-span-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[1.75rem] p-5 border border-slate-700 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all relative overflow-hidden min-h-[160px]">
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-sky-500/20 rounded-full blur-[40px] pointer-events-none"/>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-3 border border-sky-500/30"><Bot size={19}/></div>
                <h3 className="font-extrabold text-white text-sm mb-1">AI Concierge</h3>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Ask anything — mess, rules, campus events.</p>
              </div>
              <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-sky-400 mt-3">
                Chat Now <Zap size={11}/>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}

function SBItem({ icon, label, active, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${
        disabled ? "text-slate-300 opacity-50 cursor-not-allowed" :
        active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" :
        "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}>
      <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
      {disabled && <Lock size={12} className="text-slate-300"/>}
    </button>
  );
}