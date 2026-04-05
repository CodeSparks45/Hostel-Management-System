import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, MapPin, ShieldCheck, QrCode, Clock, 
  CreditCard, LogOut, Settings, Home, ChevronRight, 
  Building2, Smartphone, GraduationCap
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetching user data from local storage
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Guest Scholar",
      phone: "+91 XXXXX XXXXX",
      collegeId: "Not Provided",
      gender: "N/A",
      role: "Student"
    };
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-['Outfit',sans-serif] flex text-gray-900 selection:bg-orange-500 selection:text-white">
      {/* FONT IMPORT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif !important; }
      `}</style>

      {/* ─── PREMIUM DARK SIDEBAR ─── */}
      <aside className="hidden lg:flex w-[280px] bg-[#0B1727] flex-col justify-between p-8 border-r border-gray-800 overflow-hidden fixed top-0 left-0 h-screen z-50">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-16 relative z-10">
             <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 size={20} className="text-white" />
             </div>
             <div>
                <p className="text-xl font-black text-white leading-none tracking-tight">Stay<span className="text-orange-500 playfair italic">PG</span></p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Dashboard</p>
             </div>
          </div>

          <nav className="space-y-2 relative z-10">
            <SidebarItem icon={<User size={18}/>} label="My Profile" active />
            <SidebarItem icon={<Home size={18}/>} label="Explore Hostels" onClick={() => navigate("/home")} />
            <SidebarItem icon={<QrCode size={18}/>} label="Active Passes" onClick={() => navigate("/my-bookings")} />
            <SidebarItem icon={<CreditCard size={18}/>} label="Payment History" />
          </nav>
        </div>

        <div className="relative z-10 space-y-2">
           <SidebarItem icon={<Settings size={18}/>} label="Settings" />
           <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group">
             <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
           </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 lg:ml-[280px] p-6 md:p-12 max-w-6xl">
        
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">My Overview.</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Manage your identity and stays</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
             <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black text-lg">
               {user.name.charAt(0).toUpperCase()}
             </div>
             <div>
                <p className="text-sm font-black text-gray-800 leading-none">{user.name}</p>
                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1"><ShieldCheck size={12}/> Verified</p>
             </div>
          </div>
        </motion.header>

        {/* ─── BENTO GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* DIGITAL ID CARD (Takes up 8 columns) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="md:col-span-8 bg-gradient-to-br from-gray-900 to-[#0A1118] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl border border-gray-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
             
             <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-2">Official Digital Identity</p>
                  <h2 className="text-3xl font-black text-white tracking-tight">{user.name}</h2>
                  <p className="text-sm text-gray-400 font-medium mt-1">{user.role.toUpperCase()} • SGGSIE&T Nanded</p>
                </div>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <ShieldCheck size={32} className="text-emerald-400" />
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10 border-t border-gray-800 pt-8">
                <IDData icon={<GraduationCap size={16}/>} label="College ID" value={user.collegeId || "N/A"} />
                <IDData icon={<Smartphone size={16}/>} label="Phone Number" value={user.phone || "N/A"} />
                <IDData icon={<User size={16}/>} label="Gender Node" value={user.gender ? user.gender.toUpperCase() : "N/A"} />
             </div>
          </motion.div>

          {/* ACTIVE PASS STATUS (Takes up 4 columns) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="md:col-span-4 bg-white rounded-[2.5rem] p-8 border border-orange-100 shadow-xl shadow-orange-900/5 flex flex-col justify-between group">
             <div>
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                   <QrCode size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Active Pass</h3>
                <p className="text-sm text-gray-500 font-medium">You currently have an active institutional stay pass.</p>
             </div>
             
             <button onClick={() => navigate("/verify-payment/active")} className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-colors shadow-lg flex items-center justify-center gap-2">
                View QR Code <ChevronRight size={16} />
             </button>
          </motion.div>

          {/* QUICK STATS / INFO */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="md:col-span-4 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
             <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center"><MapPin size={24}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Node</p>
                <p className="text-lg font-black text-gray-800">Sahyadri Block A</p>
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-4 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
             <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><Clock size={24}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pass Validity</p>
                <p className="text-lg font-black text-gray-800">Valid for 24H</p>
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="md:col-span-4 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5 cursor-pointer hover:border-orange-200 transition-colors group" onClick={() => navigate("/home")}>
             <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Building2 size={24}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Actions</p>
                <p className="text-lg font-black text-orange-500">Book New Room</p>
             </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

// ─── HELPER COMPONENTS ───

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
        active 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
        : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function IDData({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 mb-1.5">
        {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-base font-bold text-white tracking-wide">{value}</p>
    </div>
  );
}