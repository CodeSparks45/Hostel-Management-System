import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, MapPin, ShieldAlert, CheckCircle, 
  Download, QrCode, LayoutDashboard, User, LogOut, Coffee 
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await API.get("/api/bookings/my");
      setBookings(res.data);
    } catch (err) {
      toast.error("Records update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-orange-900 uppercase tracking-widest">Syncing StayPG Systems...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-['Plus_Jakarta_Sans']">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-orange-100 p-8 hidden md:flex flex-col">
        <h2 className="text-2xl font-black text-orange-600 mb-10 italic">StayPG.</h2>
        <nav className="flex-1 space-y-4">
          <button className="w-full text-left bg-orange-50 p-4 rounded-2xl flex items-center gap-3 text-orange-700 font-bold tracking-tight">
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button onClick={() => navigate("/home")} className="w-full text-left p-4 rounded-2xl flex items-center gap-3 text-gray-400 font-bold hover:bg-orange-50 transition-all">
            <MapPin size={20}/> Hostels
          </button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="p-4 flex items-center gap-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20}/> Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Welcome, {user?.name.split(' ')[0]}!</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">{user?.role} Portal · SGGSIE&T</p>
          </div>
          <div className="h-14 w-14 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-orange-200">
            {user?.name[0]}
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-orange-500 p-8 rounded-[40px] text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <CheckCircle size={32} className="mb-4 opacity-70"/>
            <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Active Stay</p>
            <h3 className="text-3xl font-black">{bookings.length > 0 ? "Verified" : "None"}</h3>
          </div>
          <div className="bg-white border border-orange-100 p-8 rounded-[40px] shadow-sm">
            <Clock size={32} className="mb-4 text-orange-500"/>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Validity</p>
            <h3 className="text-2xl font-black text-gray-800">24 Hours</h3>
          </div>
          <div className="bg-white border border-orange-100 p-8 rounded-[40px] shadow-sm">
            <Coffee size={32} className="mb-4 text-orange-500"/>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mess Status</p>
            <h3 className="text-2xl font-black text-gray-800 uppercase">Active</h3>
          </div>
        </div>

        {/* NEW PREMIUM ACTION CARDS */}
        <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[35px] border border-orange-100 shadow-xl shadow-orange-900/5 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-orange-50 rounded-[24px] flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <QrCode size={28}/>
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-lg">Digital Pass</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">View Check-in QR</p>
              </div>
            </div>
            <button onClick={() => navigate("/verify-payment/sahyadri")} className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Open</button>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[35px] border border-red-50 shadow-xl shadow-red-900/5 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-red-50 rounded-[24px] flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <ShieldAlert size={28}/>
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-lg">SOS Help</h4>
                <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest">Emergency Alert</p>
              </div>
            </div>
            <button onClick={() => window.location.href="tel:+912462229234"} className="bg-red-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">SOS</button>
          </motion.div>
        </div>

        {/* BOOKINGS LIST */}
        <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">Recent Activity</h2>
        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
             <p className="text-gray-400 font-bold mb-6">No records found. Start your journey by booking a room.</p>
             <button onClick={() => navigate("/home")} className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:scale-105 transition-all">Explore Hostels</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white p-6 rounded-[30px] border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500"><MapPin size={20}/></div>
                  <div>
                    <h3 className="font-black text-gray-800 uppercase tracking-tighter italic">{b.roomId?.hostelName || 'Sahyadri'}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Room {b.roomId?.roomNumber || 'A-102'}</p>
                  </div>
                </div>
                <button className="bg-gray-50 px-6 py-3 rounded-xl text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100">
                  <Download size={14}/> Receipt
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}