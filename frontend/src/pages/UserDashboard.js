import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ShieldCheck, QrCode, LogOut, Settings, Home as HomeIcon, ChevronRight, 
  Building2, Smartphone, GraduationCap, Utensils, Wrench, Users, Bell, 
  ArrowUpRight, X, Send, CalendarCheck, BadgeCheck, Siren, Bot, Clock, AlertCircle, Lock
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import SggsLogo from "./sggs-logo.png"; 

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // 🚀 THE EXTRA-ORDINARY FEATURE: Dynamic State Management
  // "none" = No application, "pending" = Waiting for Rector, "approved" = Room Allocated
  const [bookingState, setBookingState] = useState("pending"); 

  const [activeModal, setActiveModal] = useState(null); 
  const [mealSkipped, setMealSkipped] = useState(false);
  const [ticketDescription, setTicketDescription] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Guest Scholar",
      phone: "+91 XXXXX XXXXX",
      collegeId: "Not Provided",
      gender: "male",
      role: "Student"
    };
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ADDED MISSING FUNCTION 1
  const handleSkipMeal = (e) => {
    e.stopPropagation(); 
    setMealSkipped(true);
    toast.success("Meal skipped! You just saved food wastage. 🌿");
  };

  // ADDED MISSING FUNCTION 2
  const submitTicket = (e) => {
    e.preventDefault();
    toast.success("Maintenance ticket submitted successfully! 🛠️");
    setTicketDescription("");
    setActiveModal(null);
  };

  const handleActionClick = (action) => {
    if (bookingState !== "approved") {
      toast.error("Feature locked! Waiting for Rector's approval.", {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#fff', color: '#64748b', fontWeight: 'bold' }
      });
      return;
    }
    setActiveModal(action);
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans flex text-slate-800 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* ─── SECRET DEV TOGGLE (FOR COLLEGE PRESENTATION) ─── */}
      <div className="fixed bottom-4 right-4 z-[200] bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl flex gap-2 border border-slate-700 shadow-2xl">
        <button onClick={() => setBookingState("none")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${bookingState === 'none' ? 'bg-white text-black' : 'text-slate-400'}`}>No Booking</button>
        <button onClick={() => setBookingState("pending")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${bookingState === 'pending' ? 'bg-amber-400 text-black' : 'text-slate-400'}`}>Pending</button>
        <button onClick={() => setBookingState("approved")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${bookingState === 'approved' ? 'bg-emerald-400 text-black' : 'text-slate-400'}`}>Approved</button>
      </div>

      {/* ─── MODAL OVERLAYS ─── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-slate-800 text-lg">
                  {activeModal === 'outpass' && "Smart Gate Pass"}
                  {activeModal === 'maintenance' && "Raise Maintenance Ticket"}
                  {activeModal === 'roommates' && "Roommate Directory"}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"><X size={18} /></button>
              </div>

              {/* Modals content */}
              {activeModal === 'outpass' && (
                <div className="p-8 flex flex-col items-center">
                  <div className="w-full bg-emerald-50 text-emerald-600 text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest mb-6">Status: Approved • Valid until 10:00 PM</div>
                  <div className="w-48 h-48 bg-white border-4 border-emerald-100 rounded-3xl shadow-inner flex items-center justify-center p-4 mb-6">
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-no-repeat bg-center opacity-80" />
                  </div>
                  <p className="text-slate-500 text-sm text-center font-medium">Show this dynamic QR code to the main gate security scanner.</p>
                </div>
              )}
              {activeModal === 'maintenance' && (
                <form onSubmit={submitTicket} className="p-6">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Issue Description</label>
                  <textarea 
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="E.g., The fan regulator in Room 204 is broken."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 text-sm font-medium text-slate-700 resize-none h-32 mb-6 transition-colors"
                  />
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block">Category</label>
                  <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 text-sm font-medium text-slate-700 mb-6 cursor-pointer">
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Carpentry</option>
                    <option>Cleaning</option>
                  </select>
                  <button type="submit" className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30">
                    Submit Ticket <Send size={16} />
                  </button>
                </form>
              )}
              {activeModal === 'roommates' && (
                <div className="p-6 space-y-4">
                  {[
                    { initials: "RV", name: "Rohan Verma", course: "B.Tech IT", phone: "+91 98765 12345" },
                    { initials: "AS", name: "Aditya Singh", course: "B.Tech CS", phone: "+91 87654 98765" }
                  ].map((mate, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sm font-bold text-sky-600">{mate.initials}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{mate.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{mate.course}</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors" title="Message">
                        <Smartphone size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
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
              <SidebarItem icon={<HomeIcon size={18}/>} label="Dashboard" active onClick={() => navigate('/dashboard')} />
              <SidebarItem icon={<User size={18}/>} label="My Profile" onClick={() => navigate('/complete-profile')} />
              <SidebarItem icon={<Building2 size={18}/>} label="Explore Hostels" onClick={() => navigate('/home')} />
              <SidebarItem icon={<CalendarCheck size={18}/>} label="My Bookings" onClick={() => navigate('/my-bookings')} />
              <SidebarItem icon={<BadgeCheck size={18}/>} label="Verify Pass" onClick={() => navigate('/verify-payment')} />
            </nav>
          </div>
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Quick Actions</p>
            <nav className="space-y-1.5">
              <SidebarItem icon={<QrCode size={18}/>} label="Smart Outpass" onClick={() => handleActionClick('outpass')} disabled={bookingState !== 'approved'} />
              <SidebarItem icon={<Utensils size={18}/>} label="Dining Hub" onClick={() => handleActionClick('dining')} disabled={bookingState !== 'approved'} />
              <SidebarItem icon={<Wrench size={18}/>} label="Maintenance" onClick={() => handleActionClick('maintenance')} disabled={bookingState !== 'approved'} />
            </nav>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-slate-100 pt-4 mt-2">
           <button onClick={() => navigate('/sos')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 group">
             <Siren size={18} className="animate-pulse" /> SOS Emergency
           </button>
           <SidebarItem icon={<Bot size={18}/>} label="AI Concierge" onClick={() => navigate('/helpbot')} />
           <SidebarItem icon={<Settings size={18}/>} label="Settings" onClick={() => navigate('/settings')} />
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all group">
             <LogOut size={18} /> Sign Out
           </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-1">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {bookingState === "approved" ? "Sahyadri Block • Room 204" : "SGGS Student Portal"}
            </p>
          </motion.div>
          <div className="flex gap-3">
             <button className="w-12 h-12 bg-white rounded-2xl border border-sky-100 shadow-sm flex items-center justify-center text-slate-400">
               <Bell size={20} />
             </button>
             <div onClick={() => navigate('/complete-profile')} className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-sky-100 shadow-sm cursor-pointer">
                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-black">{user.name.charAt(0).toUpperCase()}</div>
             </div>
          </div>
        </header>

        <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* ─── DYNAMIC HERO CARD (Cols 1-8) ─── */}
          {bookingState === "approved" && (
            <motion.div variants={item} className="md:col-span-8 bg-gradient-to-br from-sky-500 to-teal-400 rounded-[2rem] p-8 relative overflow-hidden shadow-xl shadow-sky-500/20 border border-sky-400 flex flex-col justify-between">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[80px] opacity-20 pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                 <div>
                   <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.3em] mb-2">Digital Campus ID</p>
                   <h2 className="text-3xl font-extrabold text-white tracking-tight">{user.name}</h2>
                   <p className="text-sm text-sky-50 font-medium mt-1">{user.role.toUpperCase()} • SGGSIE&T</p>
                 </div>
                 <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                   <ShieldCheck size={28} className="text-white" />
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-4 relative z-10 border-t border-white/20 pt-6 mt-8">
                 <IDData icon={<GraduationCap size={14}/>} label="College ID" value={user.collegeId || "2022BTECS"} />
                 <IDData icon={<Smartphone size={14}/>} label="Phone" value={user.phone || "Verified"} />
                 <IDData icon={<Building2 size={14}/>} label="Allocation" value="Room 204" />
              </div>
            </motion.div>
          )}

          {bookingState === "pending" && (
            <motion.div variants={item} className="md:col-span-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] p-8 relative overflow-hidden shadow-xl shadow-amber-500/20 border border-amber-300 flex flex-col justify-between">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[80px] opacity-20 pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                 <div>
                   <p className="text-[10px] font-bold text-amber-100 uppercase tracking-[0.3em] mb-2 flex items-center gap-2"><Clock size={12} className="animate-pulse"/> Verification in Progress</p>
                   <h2 className="text-3xl font-extrabold text-white tracking-tight">Application Under Review</h2>
                   <p className="text-sm text-amber-50 font-medium mt-2 leading-relaxed max-w-md">Your payment receipt and DU Reference Number have been submitted successfully. The Rector's office is currently verifying your details.</p>
                 </div>
                 <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                   <AlertCircle size={28} className="text-white" />
                 </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 relative z-10 flex gap-4 items-center">
                <span className="bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl">DUJ8823749</span>
                <span className="text-xs text-amber-100 font-medium">Please check back in a few hours.</span>
              </div>
            </motion.div>
          )}

          {bookingState === "none" && (
            <motion.div variants={item} className="md:col-span-8 bg-white rounded-[2rem] p-8 relative overflow-hidden shadow-sm border border-sky-100 flex flex-col justify-center items-center text-center">
              <Building2 size={48} className="text-sky-200 mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">No Active Booking</h2>
              <p className="text-sm text-slate-500 font-medium mt-2 max-w-md">You haven't applied for a hostel room yet. Explore available accommodations to start your campus journey.</p>
              <button onClick={() => navigate('/home')} className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all">Explore Hostels</button>
            </motion.div>
          )}

          {/* ─── SMART OUTPASS CARD ─── */}
          <motion.div 
            variants={item} onClick={() => handleActionClick('outpass')}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between transition-all relative overflow-hidden ${bookingState === 'approved' ? 'border-emerald-100 cursor-pointer hover:shadow-xl' : 'border-slate-100 opacity-60 grayscale cursor-not-allowed'}`}
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-[40px] opacity-50 -z-10" />
             <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><QrCode size={20} /></div>
                  {bookingState === "approved" ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Approved</span>
                  ) : (
                    <Lock size={16} className="text-slate-400" />
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-1">Smart Outpass</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Your weekend leave has been approved by the Warden.</p>
             </div>
             <div className="w-full mt-6 bg-emerald-500 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                Open Gate Pass <ChevronRight size={16} />
             </div>
          </motion.div>

          {/* ─── DINING HUB CARD ─── */}
          <motion.div variants={item} className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between ${bookingState === 'approved' ? 'border-amber-100' : 'border-slate-100 opacity-60 grayscale'}`}>
             <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Utensils size={20}/></div>
                  <div>
                    <h3 className="font-bold text-slate-800">Dining Hub</h3>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Today's Dinner</p>
                  </div>
               </div>
               <div className={`rounded-xl p-4 border transition-colors ${mealSkipped ? 'bg-slate-50 border-slate-100' : 'bg-amber-50/50 border-amber-100'}`}>
                 {mealSkipped ? (
                   <p className="text-sm font-bold text-slate-500 line-through">Paneer Butter Masala, Roti, Jeera Rice, Gulab Jamun</p>
                 ) : (
                   <p className="text-sm font-bold text-slate-700">Paneer Butter Masala, Roti, Jeera Rice, Gulab Jamun</p>
                 )}
               </div>
             </div>
             <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Served at 8:00 PM</span>
                {bookingState === "approved" && (
                  mealSkipped ? <span className="text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md"><ShieldCheck size={14}/> Skipped</span>
                  : <button onClick={handleSkipMeal} className="text-sky-500 hover:bg-sky-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1">Skip Meal <ArrowUpRight size={14}/></button>
                )}
             </div>
          </motion.div>

          {/* ─── MAINTENANCE TICKET CARD ─── */}
          <motion.div 
            variants={item} onClick={() => handleActionClick('maintenance')}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between transition-all ${bookingState === 'approved' ? 'border-rose-100 cursor-pointer hover:shadow-xl' : 'border-slate-100 opacity-60 grayscale cursor-not-allowed'}`}
          >
             <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Wrench size={20}/></div>
                  <div>
                    <h3 className="font-bold text-slate-800">Maintenance</h3>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Raise Ticket</p>
                  </div>
               </div>
               {bookingState === 'approved' ? (
                 <>
                   <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <p className="text-sm font-bold text-slate-700">Fan Regulator Broken</p>
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase rounded-md">In Progress</span>
                   </div>
                   <p className="text-xs text-slate-400 font-medium">Technician assigned. Expected today at 4:00 PM.</p>
                 </>
               ) : (
                  <p className="text-sm font-medium text-slate-400 mt-4">Room allocation required to raise tickets.</p>
               )}
             </div>
             {bookingState === 'approved' && <div className="mt-4 text-xs font-bold text-sky-500">+ Raise New Issue</div>}
          </motion.div>

          {/* ─── ROOMMATES CARD ─── */}
          <motion.div 
            variants={item} onClick={() => handleActionClick('roommates')}
            className={`md:col-span-4 bg-white rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between transition-all ${bookingState === 'approved' ? 'border-sky-100 cursor-pointer hover:shadow-xl' : 'border-slate-100 opacity-60 grayscale cursor-not-allowed'}`}
          >
             <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center"><Users size={20}/></div>
                  <div>
                    <h3 className="font-bold text-slate-800">My Roommates</h3>
                    <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest">{bookingState === 'approved' ? 'Room 204' : 'Unallocated'}</p>
                  </div>
               </div>
               {bookingState === 'approved' ? (
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">RV</div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Rohan Verma</p>
                        <p className="text-[10px] text-slate-400 font-medium">B.Tech IT</p>
                      </div>
                    </div>
                 </div>
               ) : (
                 <p className="text-sm font-medium text-slate-400 mt-4">You will be able to see your roommates here once a room is assigned.</p>
               )}
             </div>
             {bookingState === 'approved' && <div className="mt-4 text-xs font-bold text-sky-500">View Contacts <ArrowUpRight size={14}/></div>}
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, disabled }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
        disabled ? 'text-slate-400 opacity-60 cursor-not-allowed' :
        active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon} <span className="tracking-wide">{label}</span>
      </div>
      {disabled && <Lock size={14} className="text-slate-300" />}
    </button>
  );
}

function IDData({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-sky-100 mb-1">
        {icon} <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-white tracking-wide">{value}</p>
    </div>
  );
}