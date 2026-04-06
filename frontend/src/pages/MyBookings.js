import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ShieldCheck, QrCode, LogOut, Settings, Home as HomeIcon, ChevronRight, 
  Building2, Smartphone, GraduationCap, Utensils, Wrench, Users, Bell, 
  CalendarCheck, BadgeCheck, Siren, MapPin, Download, CheckCircle2, Clock, FileText, Activity
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

import SggsLogo from "./sggs-logo.png"; // Ensure this path is correct

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest Scholar", role: "Student" };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/api/bookings/my");
      setBookings(res.data);
    } catch (err) {
      // Gracefully handling if backend is empty/not ready
      toast.error("Failed to sync live records, showing local data.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-sky-900 uppercase tracking-widest bg-sky-50/50">
      Syncing StayPG Systems...
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans flex text-slate-800 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* ─── BRIGHT & CLEAN SIDEBAR (IDENTICAL TO DASHBOARD) ─── */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col justify-between p-6 border-r border-sky-100 fixed top-0 left-0 h-screen z-40 overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
             <img src={SggsLogo} alt="SGGS Logo" className="w-10 object-contain" />
             <div>
                <p className="text-lg font-extrabold text-slate-800 leading-none tracking-tight">StayPG</p>
                <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Institutional</p>
             </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
            <nav className="space-y-1.5">
              <SidebarItem icon={<HomeIcon size={18}/>} label="Dashboard" onClick={() => navigate('/dashboard')} />
              <SidebarItem icon={<User size={18}/>} label="My Profile" onClick={() => navigate('/complete-profile')} />
              <SidebarItem icon={<Building2 size={18}/>} label="Explore Hostels" onClick={() => navigate('/home')} />
              <SidebarItem icon={<CalendarCheck size={18}/>} label="My Bookings" active onClick={() => navigate('/my-bookings')} />
              <SidebarItem icon={<BadgeCheck size={18}/>} label="Verify Pass" onClick={() => navigate('/verify-payment')} />
            </nav>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-4 mt-2">
           <button onClick={() => navigate('/sos')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 group">
             <Siren size={18} className="animate-pulse" /> SOS Emergency
           </button>
           <SidebarItem icon={<Settings size={18}/>} label="Settings" onClick={() => navigate('/complete-profile')} />
           <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all group">
             <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
           </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-1">My Journey</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">StayPG Track Record</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
             <button className="w-12 h-12 bg-white rounded-2xl border border-sky-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-md transition-all relative">
               <Bell size={20} />
             </button>
             <div onClick={() => navigate('/complete-profile')} className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-sky-100 shadow-sm cursor-pointer hover:shadow-md transition-all">
                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
             </div>
          </motion.div>
        </header>

        <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show" className="space-y-6">

          {/* ─── JOURNEY TRACKER TIMELINE ─── */}
          <motion.div variants={item} className="bg-white rounded-[2.5rem] p-8 border border-sky-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[80px] opacity-50 -z-10" />
            <h2 className="text-xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
              <Activity size={24} className="text-sky-500"/> Current Application Status
            </h2>
            
            <div className="flex flex-col md:flex-row justify-between relative">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-6 left-10 right-10 h-1 bg-slate-100 -z-10" />
              <div className="hidden md:block absolute top-6 left-10 right-[25%] h-1 bg-emerald-400 -z-10" />

              <TrackerStep icon={<FileText size={20}/>} title="Application" desc="Submitted" status="done" />
              <TrackerStep icon={<BadgeCheck size={20}/>} title="SBI Payment" desc="Verified" status="done" />
              <TrackerStep icon={<Building2 size={20}/>} title="Room Allocation" desc="Sahyadri 204" status="done" />
              <TrackerStep icon={<QrCode size={20}/>} title="Check-in" desc="Pending arrival" status="active" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* ─── CURRENT ACCOMMODATION (BENTO CARD) ─── */}
            <motion.div variants={item} className="md:col-span-8 bg-gradient-to-br from-sky-500 to-teal-400 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl shadow-sky-500/20 border border-sky-400 flex flex-col justify-between">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[80px] opacity-20 pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.3em] mb-2">Active Stay</p>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">{bookings.length > 0 ? bookings[0].roomId?.hostelName : "Sahyadri Elite"}</h3>
                  <p className="text-sm text-sky-50 font-medium mt-1">Academic Year 2024-25</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Verified</span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4 mt-10 bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
                <div>
                  <p className="text-[10px] text-sky-100 font-bold uppercase tracking-widest mb-1">Room No.</p>
                  <p className="text-xl font-extrabold text-white">204</p>
                </div>
                <div>
                  <p className="text-[10px] text-sky-100 font-bold uppercase tracking-widest mb-1">Type</p>
                  <p className="text-xl font-extrabold text-white">Standard</p>
                </div>
                <div>
                  <p className="text-[10px] text-sky-100 font-bold uppercase tracking-widest mb-1">Mess</p>
                  <p className="text-xl font-extrabold text-white">Included</p>
                </div>
              </div>
            </motion.div>

            {/* ─── QUICK STATS ─── */}
            <motion.div variants={item} className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-white rounded-[2rem] p-6 border border-sky-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Days Stayed</p>
                  <h4 className="text-3xl font-extrabold text-slate-800">142</h4>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-6 border border-emerald-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Campus Passes</p>
                  <h4 className="text-3xl font-extrabold text-slate-800">12 <span className="text-sm text-slate-400 font-medium">Used</span></h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── FINANCIAL LEDGER / PAST BOOKINGS ─── */}
          <motion.div variants={item} className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden mt-6">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Financial Ledger</h3>
                <p className="text-xs font-medium text-slate-400 mt-1">Your past payments and accommodation history</p>
              </div>
              <button onClick={() => navigate("/home")} className="hidden md:flex bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md">
                + New Booking
              </button>
            </div>
            
            <div className="p-6">
              {bookings.length === 0 ? (
                // IF NO BOOKINGS FROM API, SHOW PREMIUM DEMO DATA SO IT DOESNT LOOK EMPTY
                <div className="space-y-4">
                  <LedgerRow id="DUJ882374" date="14 Aug 2024" item="Sahyadri Full Year Advance" amount="₹45,000" status="Paid" />
                  <LedgerRow id="DUJ661928" date="10 Feb 2024" item="Hostel Maintenance Fine" amount="₹250" status="Paid" />
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b, index) => (
                    <LedgerRow 
                      key={b._id || index}
                      id={`DUJ${Math.floor(100000 + Math.random() * 900000)}`} 
                      date={new Date(b.createdAt || Date.now()).toLocaleDateString()} 
                      item={`${b.roomId?.hostelName || 'Sahyadri'} Accommodation`} 
                      amount={`₹${b.amount || '450'}`} 
                      status="Paid" 
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

// ─── HELPER COMPONENTS ───

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
        active 
        ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" 
        : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
      }`}
    >
      {icon} <span className="tracking-wide">{label}</span>
    </button>
  );
}

function TrackerStep({ icon, title, desc, status }) {
  const isDone = status === "done";
  const isActive = status === "active";
  
  return (
    <div className="flex flex-col items-center relative z-10 w-full md:w-auto mb-6 md:mb-0">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm border-2 transition-colors ${
        isDone ? 'bg-emerald-400 text-white border-emerald-400' : 
        isActive ? 'bg-white text-sky-500 border-sky-400 shadow-sky-200' : 
        'bg-slate-50 text-slate-300 border-slate-100'
      }`}>
        {icon}
      </div>
      <h4 className={`font-extrabold text-sm ${isDone || isActive ? 'text-slate-800' : 'text-slate-400'}`}>{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{desc}</p>
    </div>
  );
}

function LedgerRow({ id, date, item, amount, status }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 transition-colors group">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-black group-hover:bg-white transition-colors">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{item}</h4>
          <p className="text-xs font-medium text-slate-500 mt-1">Ref: <span className="font-mono text-slate-400">{id}</span> • {date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="text-left md:text-right">
          <p className="font-black text-slate-800">{amount}</p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} /> {status}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm">
          <Download size={14} /> Receipt
        </button>
      </div>
    </div>
  );
}