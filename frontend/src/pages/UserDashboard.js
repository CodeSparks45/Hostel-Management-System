import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, ShieldCheck, QrCode, LogOut, Settings, Home as HomeIcon, ChevronRight,
  Building2, Smartphone, GraduationCap, Utensils, Wrench, Bell,
  ArrowUpRight, X, Send, CalendarCheck, BadgeCheck, Siren, Bot, Clock,
  AlertCircle, Lock,  Wifi,
  Moon, Sun, Activity,  Coffee, Wind, Shield, Zap, Star
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import API from "../services/api";

import SggsLogo from "./sggs-logo.png";

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Guest Scholar", phone: "+91 XXXXX XXXXX",
      collegeId: "Not Provided", gender: "male", role: "Student"
    };
    setUser(storedUser);
    fetchLatestBooking();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const bookingTimer = setInterval(fetchLatestBooking, 10000);
    return () => { clearInterval(timer); clearInterval(bookingTimer); };
  }, []);

  const fetchLatestBooking = async () => {
    try {
      const res = await API.get("/api/book/my");
      const bookings = res.data;
      if (!bookings || bookings.length === 0) {
        setBookingState("none");
        setLatestBooking(null);
        return;
      }
      const latest = bookings[0];
      const status = latest?.paymentStatus || latest?.status;
      setLatestBooking(latest);
      if (status === "approved") setBookingState("approved");
      else if (status === "rejected") setBookingState("none");
      else setBookingState("pending");
    } catch (err) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || err?.response?.status === 401) {
        setBookingState("none");
      }
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const handleSkipMeal = (e) => {
    e.stopPropagation();
    setMealSkipped(true);
    toast.success("Meal skipped! You just saved food wastage. 🌿");
  };

  const submitTicket = (e) => {
    e.preventDefault();
    toast.success("Maintenance ticket submitted! Technician assigned. 🛠️");
    setTicketDescription("");
    setActiveModal(null);
  };

  const handleActionClick = (action) => {
    if (bookingState !== "approved") {
      toast.error("Feature locked! Waiting for Rector's approval.", {
        icon: "🔒",
        style: { borderRadius: "12px", background: "#fff", color: "#64748b", fontWeight: "bold" }
      });
      return;
    }
    setActiveModal(action);
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const timeOfDay = currentTime.getHours();
  const greeting = timeOfDay < 12 ? "Good morning" : timeOfDay < 17 ? "Good afternoon" : "Good evening";

  const facilities = [
    { icon: <Wifi size={16} />, label: "Wi-Fi", status: "Online", color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
    { icon: <Wind size={16} />, label: "AC", status: bookingState === "approved" ? "Active" : "—", color: "text-sky-500 bg-sky-50 border-sky-100" },
    { icon: <Coffee size={16} />, label: "Mess", status: "Open", color: "text-amber-500 bg-amber-50 border-amber-100" },
    { icon: <Shield size={16} />, label: "Security", status: "24/7", color: "text-purple-500 bg-purple-50 border-purple-100" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* ─── MODAL OVERLAYS ─── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-lg">
                  {activeModal === "outpass" && "🚪 Smart Gate Pass"}
                  {activeModal === "maintenance" && "🔧 Raise Maintenance Ticket"}
                  {activeModal === "staff" && "👔 Room Occupants"}
                  {activeModal === "dining" && "🍽️ Dining Hub"}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {activeModal === "outpass" && (
                <div className="p-8 flex flex-col items-center">
                  <div className="w-full bg-emerald-50 text-emerald-600 text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-100">
                    Status: Approved • Valid until 10:00 PM
                  </div>
                  <div className="w-48 h-48 bg-white border-4 border-slate-100 rounded-3xl shadow-inner flex items-center justify-center p-4 mb-6">
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-no-repeat bg-center opacity-80" />
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Resident</span><span className="font-extrabold text-slate-800">{user.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Room</span><span className="font-extrabold text-slate-800">{latestBooking?.roomNumber || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold">Valid Till</span><span className="font-extrabold text-emerald-600">10:00 PM Tonight</span></div>
                  </div>
                  <p className="text-slate-500 text-xs text-center font-medium mt-4">Show this dynamic QR at the main gate security scanner.</p>
                </div>
              )}

              {activeModal === "maintenance" && (
                <form onSubmit={submitTicket} className="p-6">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Electrical", "Plumbing", "Carpentry", "Cleaning"].map(cat => (
                      <button key={cat} type="button"
                        onClick={() => setTicketCategory(cat)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${ticketCategory === cat ? "bg-sky-500 text-white border-sky-500" : "bg-slate-50 text-slate-600 border-slate-100 hover:border-sky-200"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Issue Description</label>
                  <textarea required value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="E.g., The ceiling fan in my room is making noise."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 text-sm font-medium text-slate-700 resize-none h-28 mb-4 transition-colors" />
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Priority</label>
                  <select className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 text-sm font-bold text-slate-700 mb-5">
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                  <button type="submit" className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20">
                    Submit Ticket <Send size={16} />
                  </button>
                </form>
              )}

              {activeModal === "staff" && (
                <div className="p-6 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Staff & Officials in Your Block</p>
                  {[
                    { initials: "SRD", name: "Prof. S.R. Deshmukh", role: "Chief Warden", dept: "Sahyadri Block", contact: "+91 98765 00001" },
                    { initials: "AKP", name: "Mr. A.K. Patil", role: "Hostel Superintendent", dept: "Admin Office", contact: "+91 98765 00002" },
                  ].map((person, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center text-xs font-extrabold text-sky-700">{person.initials}</div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-800">{person.name}</p>
                          <p className="text-[10px] text-sky-500 font-bold uppercase tracking-wider">{person.role}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{person.dept}</p>
                        </div>
                      </div>
                      <a href={`tel:${person.contact}`} className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-colors">
                        <Smartphone size={14} />
                      </a>
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-400 text-center font-medium mt-2">For emergencies, use the SOS button on the sidebar.</p>
                </div>
              )}

              {activeModal === "dining" && (
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    {[
                      { meal: "Breakfast", time: "7:30 – 9:00 AM", menu: "Poha, Jalebi, Chai", icon: "🌅" },
                      { meal: "Lunch", time: "12:30 – 2:00 PM", menu: "Rajma Chawal, Roti, Salad, Buttermilk", icon: "☀️" },
                      { meal: "Dinner", time: "8:00 – 10:00 PM", menu: "Paneer Butter Masala, Roti, Jeera Rice, Gulab Jamun", icon: "🌙" },
                    ].map((m, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-extrabold text-slate-800">{m.icon} {m.meal}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{m.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{m.menu}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setMealSkipped(true); setActiveModal(null); toast.success("Tonight's dinner skipped! 🌿"); }}
                    className="w-full bg-amber-50 text-amber-700 border border-amber-100 py-3.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors">
                    Skip Tonight's Dinner
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col justify-between py-6 border-r border-slate-100 fixed top-0 left-0 h-screen z-40">
        <div className="px-5">
          <div className="flex items-center gap-3 mb-8">
            <img src={SggsLogo} alt="SGGS Logo" className="w-9 object-contain" />
            <div>
              <p className="text-base font-extrabold text-slate-800 leading-none tracking-tight">StayPG</p>
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Institutional</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.2em] px-3 mb-2">Main Menu</p>
            <nav className="space-y-0.5">
              <SidebarItem icon={<HomeIcon size={17} />} label="Dashboard" active onClick={() => navigate("/dashboard")} />
              <SidebarItem icon={<User size={17} />} label="My Profile" onClick={() => navigate("/complete-profile")} />
              <SidebarItem icon={<Building2 size={17} />} label="Explore Hostels" onClick={() => navigate("/home")} />
              <SidebarItem icon={<CalendarCheck size={17} />} label="My Bookings" onClick={() => navigate("/my-bookings")} />
              <SidebarItem icon={<BadgeCheck size={17} />} label="Verify Pass" onClick={() => navigate("/verify-payment")} />
            </nav>
          </div>

          <div className="mb-5">
            <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.2em] px-3 mb-2">Quick Actions</p>
            <nav className="space-y-0.5">
              <SidebarItem icon={<QrCode size={17} />} label="Smart Outpass" onClick={() => handleActionClick("outpass")} disabled={bookingState !== "approved"} />
              <SidebarItem icon={<Utensils size={17} />} label="Dining Hub" onClick={() => handleActionClick("dining")} disabled={bookingState !== "approved"} />
              <SidebarItem icon={<Wrench size={17} />} label="Maintenance" onClick={() => handleActionClick("maintenance")} disabled={bookingState !== "approved"} />
            </nav>
          </div>

          {bookingState === "approved" && (
            <div className="mx-2 mb-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Campus Status</p>
              <div className="space-y-2">
                {facilities.map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center border ${f.color}`}>{f.icon}</span>
                      {f.label}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">{f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 space-y-0.5 border-t border-slate-100 pt-4">
          <button onClick={() => navigate("/sos")} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 mb-1">
            <Siren size={17} className="animate-pulse" /> SOS Emergency
          </button>
          <SidebarItem icon={<Bot size={17} />} label="AI Concierge" onClick={() => navigate("/helpbot")} />
          <SidebarItem icon={<Settings size={17} />} label="Settings" onClick={() => navigate("/settings")} />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-rose-500 transition-all">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                {greeting}, {user.name.split(" ")[0]} 👋
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {bookingState === "approved" ? `${latestBooking?.hostelName || "Sahyadri"} • Room ${latestBooking?.roomNumber || "—"}` : "SGGS Student Portal"}
              </p>
              {bookingState === "approved" && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </div>
          </motion.div>

          <div className="flex gap-2 items-center">
            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-600 shadow-sm">
              <Clock size={14} className="text-sky-500" />
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <button onClick={toggleTheme} className="w-11 h-11 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 hover:text-sky-500 hover:border-sky-100 transition-all">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="w-11 h-11 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-100 transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Alerts</p>
                    {[
                      { icon: "🏠", msg: "Rector approved your room request", time: "2h ago", color: "bg-emerald-50" },
                      { icon: "💳", msg: "SBI payment receipt verified", time: "3h ago", color: "bg-sky-50" },
                      { icon: "📢", msg: "Mess menu updated for this week", time: "Yesterday", color: "bg-amber-50" },
                    ].map((n, i) => (
                      <div key={i} className={`flex gap-3 p-3 ${n.color} rounded-xl mb-2 last:mb-0`}>
                        <span className="text-lg">{n.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-snug">{n.msg}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div onClick={() => navigate("/complete-profile")} className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-sky-200 transition-all">
              <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center font-black text-sm">{user.name.charAt(0).toUpperCase()}</div>
              <span className="text-sm font-bold text-slate-700">{user.name.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* ─── HERO CARD ─── */}
          {bookingState === "approved" && (
            <motion.div variants={item} className="md:col-span-8 bg-gradient-to-br from-sky-500 to-teal-400 rounded-[2rem] p-7 relative overflow-hidden shadow-xl shadow-sky-500/20 border border-sky-400 flex flex-col justify-between min-h-[220px]">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white rounded-full blur-[70px] opacity-20 pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.3em] mb-2">Digital Campus ID · Active</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h2>
                  <p className="text-sm text-sky-50 font-medium mt-1">{user.role?.toUpperCase()} · SGGSIE&T</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <ShieldCheck size={24} className="text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 relative z-10 border-t border-white/20 pt-5 mt-6">
                <IDData icon={<GraduationCap size={13} />} label="College ID" value={user.collegeId || "2022BTECS"} />
                <IDData icon={<Smartphone size={13} />} label="Phone" value={user.phone || "Verified"} />
                <IDData icon={<Building2 size={13} />} label="Room" value={latestBooking?.roomNumber || "—"} />
              </div>
            </motion.div>
          )}

          {bookingState === "pending" && (
            <motion.div variants={item} className="md:col-span-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] p-7 relative overflow-hidden shadow-xl shadow-amber-500/20 border border-amber-300 flex flex-col justify-between min-h-[220px]">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white rounded-full blur-[70px] opacity-20 pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-amber-100 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                    <Clock size={11} className="animate-pulse" /> Verification in Progress
                  </p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Application Under Review</h2>
                  <p className="text-sm text-amber-50 font-medium mt-2 leading-relaxed max-w-md">Your payment receipt and DU Reference Number have been submitted. The Rector's office is verifying your details.</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <AlertCircle size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-white/20 relative z-10 flex gap-3 items-center flex-wrap">
                <span className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-sm">
                  {latestBooking?.duNumber || "Ref: Processing"}
                </span>
                <span className="text-xs text-amber-100 font-medium">Please check back in a few hours.</span>
                <button onClick={() => navigate("/my-bookings")} className="ml-auto text-xs text-white font-bold bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                  Track Status →
                </button>
              </div>
            </motion.div>
          )}

          {bookingState === "none" && (
            <motion.div variants={item} className="md:col-span-8 bg-white rounded-[2rem] p-8 relative overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[60px] opacity-60 -z-10" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
                    <Building2 size={24} className="text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Welcome to StayPG</h2>
                    <p className="text-sm text-slate-500 font-medium">SGGSIE&T Institutional Hostel System</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed">You haven't booked a hostel room yet. Browse Sahyadri Boys Hostel and Krishna Girls Hostel to find your perfect stay.</p>
              </div>
              <div className="flex gap-3 mt-6 flex-wrap">
                <button onClick={() => navigate("/home")} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2">
                  <Building2 size={16} /> Explore Hostels
                </button>
                <button onClick={() => navigate("/complete-profile")} className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-6 py-3 rounded-xl text-sm font-bold border border-slate-100 transition-all flex items-center gap-2">
                  <User size={16} /> Complete Profile
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── SMART OUTPASS CARD ─── */}
          <motion.div variants={item} onClick={() => handleActionClick("outpass")}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between transition-all relative overflow-hidden min-h-[220px] ${bookingState === "approved" ? "border-emerald-100 cursor-pointer hover:shadow-xl hover:border-emerald-200" : "border-slate-100 opacity-60 grayscale cursor-not-allowed"}`}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-full blur-[30px] opacity-60 -z-10" />
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><QrCode size={20} /></div>
                {bookingState === "approved" ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">Live</span>
                ) : <Lock size={15} className="text-slate-400" />}
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-1">Smart Outpass</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Generate a dynamic QR pass for hostel gate entry and exit.</p>
            </div>
            <div className={`w-full mt-5 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${bookingState === "approved" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600" : "bg-slate-100 text-slate-400"}`}>
              Open Gate Pass <ChevronRight size={15} />
            </div>
          </motion.div>

          {/* ─── DINING HUB CARD ─── */}
          <motion.div variants={item} onClick={() => handleActionClick("dining")}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between min-h-[200px] ${bookingState === "approved" ? "border-amber-100 cursor-pointer hover:shadow-xl hover:border-amber-200" : "border-slate-100 opacity-60 grayscale cursor-not-allowed"}`}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Utensils size={20} /></div>
                <div>
                  <h3 className="font-extrabold text-slate-800">Dining Hub</h3>
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Today's Dinner</p>
                </div>
              </div>
              <div className={`rounded-xl p-3 border transition-colors ${mealSkipped ? "bg-slate-50 border-slate-100" : "bg-amber-50/50 border-amber-100"}`}>
                <p className={`text-sm font-bold ${mealSkipped ? "text-slate-400 line-through" : "text-slate-700"}`}>Paneer Butter Masala, Roti, Jeera Rice, Gulab Jamun</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Served at 8:00 PM</span>
              {bookingState === "approved" && (
                mealSkipped
                  ? <span className="text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><ShieldCheck size={12} /> Skipped</span>
                  : <button onClick={handleSkipMeal} className="text-sky-500 hover:bg-sky-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1">Skip <ArrowUpRight size={12} /></button>
              )}
            </div>
          </motion.div>

          {/* ─── MAINTENANCE CARD ─── */}
          <motion.div variants={item} onClick={() => handleActionClick("maintenance")}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between min-h-[200px] transition-all ${bookingState === "approved" ? "border-rose-100 cursor-pointer hover:shadow-xl hover:border-rose-200" : "border-slate-100 opacity-60 grayscale cursor-not-allowed"}`}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Wrench size={20} /></div>
                <div>
                  <h3 className="font-extrabold text-slate-800">Maintenance</h3>
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Raise Ticket</p>
                </div>
              </div>
              {bookingState === "approved" ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                    <p className="text-sm font-bold text-slate-700">Fan Regulator Broken</p>
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase rounded-md border border-amber-100">In Progress</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Technician assigned. Expected today at 4:00 PM.</p>
                </>
              ) : (
                <p className="text-sm font-medium text-slate-400 mt-3">Room allocation required to raise tickets.</p>
              )}
            </div>
            {bookingState === "approved" && (
              <div className="mt-3 text-xs font-bold text-sky-500 flex items-center gap-1">+ Raise New Issue <ArrowUpRight size={12} /></div>
            )}
          </motion.div>

          {/* ─── BLOCK OFFICIALS CARD ─── */}
          <motion.div variants={item} onClick={() => handleActionClick("staff")}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between min-h-[200px] transition-all ${bookingState === "approved" ? "border-sky-100 cursor-pointer hover:shadow-xl hover:border-sky-200" : "border-slate-100 opacity-60 grayscale cursor-not-allowed"}`}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center"><User size={20} /></div>
                <div>
                  <h3 className="font-extrabold text-slate-800">Block Officials</h3>
                  <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest">{bookingState === "approved" ? "Sahyadri Wing" : "Unallocated"}</p>
                </div>
              </div>
              {bookingState === "approved" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-[10px] font-extrabold text-sky-700">SRD</div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">Prof. S.R. Deshmukh</p>
                      <p className="text-[10px] text-slate-400 font-medium">Chief Warden</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-500">AKP</div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">Mr. A.K. Patil</p>
                      <p className="text-[10px] text-slate-400 font-medium">Superintendent</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-400 mt-3">Block officials will be visible once you're allocated a room.</p>
              )}
            </div>
            {bookingState === "approved" && (
              <div className="mt-3 text-xs font-bold text-sky-500 flex items-center gap-1">View All Contacts <ArrowUpRight size={12} /></div>
            )}
          </motion.div>

          {/* ─── CAMPUS ACTIVITY CARD ─── */}
          <motion.div variants={item} className="md:col-span-4 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col gap-3 min-h-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
              <div>
                <h3 className="font-extrabold text-slate-800">Campus Activity</h3>
                <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">Live Updates</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {[
                { icon: "📚", text: "Library open till 12 midnight", type: "info" },
                { icon: "⚡", text: "Power maintenance: Block B, 2–4 PM", type: "warn" },
                { icon: "🏋️", text: "Gym open: 6–8 AM & 5–8 PM", type: "info" },
              ].map((a, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs font-medium ${a.type === "warn" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                  <span className="text-sm mt-0.5">{a.icon}</span>
                  <span className="font-bold">{a.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── AI CONCIERGE QUICK CARD ─── */}
          <motion.div variants={item} onClick={() => navigate("/helpbot")}
            className="md:col-span-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 border border-slate-700 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all relative overflow-hidden min-h-[200px]">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-sky-500/20 rounded-full blur-[50px] pointer-events-none" />
            <div className="relative z-10">
              <div className="w-11 h-11 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-4 border border-sky-500/30">
                <Bot size={20} />
              </div>
              <h3 className="font-extrabold text-white text-lg mb-1">AI Concierge</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">Ask anything about mess menu, outpass rules, campus events, and more.</p>
            </div>
            <div className="relative z-10 mt-4 flex items-center gap-2 text-xs font-bold text-sky-400">
              Chat Now <Zap size={12} />
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${disabled ? "text-slate-300 opacity-60 cursor-not-allowed" : active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
      <div className="flex items-center gap-3">{icon} <span className="tracking-wide">{label}</span></div>
      {disabled && <Lock size={13} className="text-slate-300" />}
    </button>
  );
}

function IDData({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-sky-100 mb-1">
        {icon} <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-white tracking-wide truncate">{value}</p>
    </div>
  );
}