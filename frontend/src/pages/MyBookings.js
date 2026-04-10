import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, ShieldCheck, QrCode, LogOut, Settings, Home as HomeIcon,
  Building2, Bell, CalendarCheck, BadgeCheck, Siren, Download,
  CheckCircle2, Clock, FileText, Activity, AlertCircle, X
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(null); // booking id for QR modal
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest Scholar" };

  // ✅ Load from localStorage (set by VerifyPayment & updated by RectorDashboard)
  useEffect(() => {
    const loadBookings = () => {
      const stored = JSON.parse(localStorage.getItem("myBookings")) || [];
      setBookings(stored);
      setLoading(false);
    };
    loadBookings();
    // Refresh every 3 seconds to catch rector approvals
    const interval = setInterval(loadBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const getTrackerStatus = (booking) => {
    if (!booking) return { app: "done", pay: "done", room: "pending", checkin: "pending" };
    if (booking.bookingStatus === "approved") return { app: "done", pay: "done", room: "done", checkin: "active" };
    if (booking.bookingStatus === "rejected") return { app: "done", pay: "done", room: "rejected", checkin: "pending" };
    return { app: "done", pay: "done", room: "pending", checkin: "pending" };
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-sky-900 uppercase tracking-widest bg-sky-50/50">
      Syncing StayPG Systems...
    </div>
  );

  const latestBooking = bookings[0] || null;
  const trackerStatus = getTrackerStatus(latestBooking);
  const isApproved = latestBooking?.bookingStatus === "approved";
  const isPending = latestBooking?.bookingStatus === "pending";
  const isRejected = latestBooking?.bookingStatus === "rejected";

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans flex text-slate-800 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* ─── SIDEBAR ─── */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col justify-between p-6 border-r border-sky-100 fixed top-0 left-0 h-screen z-40 overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-800 leading-none tracking-tight">StayPG</p>
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Institutional</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
            <nav className="space-y-1.5">
              <SidebarItem icon={<HomeIcon size={18} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
              <SidebarItem icon={<User size={18} />} label="My Profile" onClick={() => navigate("/complete-profile")} />
              <SidebarItem icon={<Building2 size={18} />} label="Explore Hostels" onClick={() => navigate("/home")} />
              <SidebarItem icon={<CalendarCheck size={18} />} label="My Bookings" active onClick={() => navigate("/my-bookings")} />
              <SidebarItem icon={<BadgeCheck size={18} />} label="Verify Pass" onClick={() => navigate("/verify-payment")} />
            </nav>
          </div>
        </div>
        <div className="space-y-1.5 border-t border-slate-100 pt-4 mt-2">
          <button onClick={() => navigate("/sos")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20">
            <Siren size={18} className="animate-pulse" /> SOS Emergency
          </button>
          <SidebarItem icon={<Settings size={18} />} label="Settings" onClick={() => navigate("/complete-profile")} />
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">

        <header className="flex justify-between items-end mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-1">My Journey</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">StayPG Track Record</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <button className="w-12 h-12 bg-white rounded-2xl border border-sky-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all">
              <Bell size={20} />
            </button>
            <div onClick={() => navigate("/complete-profile")} className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-sky-100 shadow-sm cursor-pointer hover:shadow-md transition-all">
              <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-black">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </motion.div>
        </header>

        <motion.div variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show" className="space-y-6">

          {/* ─── STATUS BANNER ─── */}
          {latestBooking && (
            <motion.div variants={item}>
              {isPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                  <Clock size={20} className="text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-800">Awaiting Rector Approval</p>
                    <p className="text-xs text-amber-600 mt-0.5">DU Ref: <span className="font-mono font-black">{latestBooking.id}</span> — Receipt uploaded. Rector is reviewing your request.</p>
                  </div>
                </div>
              )}
              {isApproved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-800">✅ Room Approved! Welcome to {latestBooking.hostelName} Hostel</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Room {latestBooking.roomNumber} — Check-in: {latestBooking.checkin} | Check-out: {latestBooking.checkout}</p>
                  </div>
                </div>
              )}
              {isRejected && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                  <AlertCircle size={20} className="text-rose-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-rose-800">Request Rejected</p>
                    <p className="text-xs text-rose-600 mt-0.5">Please contact the Rector's office or try booking again.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── JOURNEY TRACKER ─── */}
          <motion.div variants={item} className="bg-white rounded-[2.5rem] p-8 border border-sky-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[80px] opacity-50 -z-10" />
            <h2 className="text-xl font-extrabold text-slate-800 mb-8 flex items-center gap-2">
              <Activity size={24} className="text-sky-500" /> Current Application Status
            </h2>
            <div className="flex flex-col md:flex-row justify-between relative">
              <div className="hidden md:block absolute top-6 left-10 right-10 h-1 bg-slate-100 -z-10" />
              <div className={`hidden md:block absolute top-6 left-10 h-1 -z-10 bg-emerald-400 transition-all duration-700 ${isApproved ? "right-10" : isPending ? "right-[50%]" : "right-[75%]"}`} />
              <TrackerStep icon={<FileText size={20} />} title="Application" desc="Submitted" status="done" />
              <TrackerStep icon={<BadgeCheck size={20} />} title="SBI Payment" desc="Verified" status="done" />
              <TrackerStep
                icon={<Building2 size={20} />}
                title="Room Allocation"
                desc={isApproved ? `${latestBooking?.hostelName} ${latestBooking?.roomNumber}` : isPending ? "Pending Approval" : isRejected ? "Rejected" : "Awaiting"}
                status={isApproved ? "done" : isRejected ? "rejected" : "active"}
              />
              <TrackerStep
                icon={<QrCode size={20} />}
                title="Check-in"
                desc={isApproved ? "QR Pass Ready" : "Pending approval"}
                status={isApproved ? "active" : "pending"}
              />
            </div>
          </motion.div>

          {/* ─── ACCOMMODATION CARD ─── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div variants={item} className={`md:col-span-8 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl border flex flex-col justify-between ${isApproved ? "bg-gradient-to-br from-sky-500 to-teal-400 border-sky-400 shadow-sky-500/20" : "bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500 shadow-slate-500/20"}`}>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[80px] opacity-20 pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mb-2">
                    {isApproved ? "Active Stay" : isPending ? "Pending Review" : isRejected ? "Request Rejected" : "No Active Booking"}
                  </p>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    {isApproved ? latestBooking?.hostelName : isPending ? "Under Review" : "Book a Room"}
                  </h3>
                  <p className="text-sm text-white/70 font-medium mt-1">SGGSIE&T Campus, Nanded</p>
                </div>
                <div className={`backdrop-blur-md px-4 py-2 rounded-xl border flex items-center gap-2 ${isApproved ? "bg-white/20 border-white/30" : "bg-white/10 border-white/20"}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${isApproved ? "bg-emerald-400" : isPending ? "bg-amber-400" : "bg-rose-400"}`} />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {isApproved ? "Approved" : isPending ? "Pending" : isRejected ? "Rejected" : "None"}
                  </span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4 mt-10 bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
                <div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Room No.</p>
                  <p className="text-xl font-extrabold text-white">{isApproved ? latestBooking?.roomNumber : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Check-in</p>
                  <p className="text-sm font-extrabold text-white">{isApproved ? latestBooking?.checkin?.split("—")[0] : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Check-out</p>
                  <p className="text-sm font-extrabold text-white">{isApproved ? latestBooking?.checkout?.split("—")[0] : "—"}</p>
                </div>
              </div>
            </motion.div>

            {/* ─── QUICK ACTIONS ─── */}
            <motion.div variants={item} className="md:col-span-4 grid grid-rows-2 gap-6">
              {/* QR Pass button */}
              <button
                onClick={() => {
                  if (isApproved) setShowQR(latestBooking?.id);
                  else toast.error("QR Pass available only after Rector approval!");
                }}
                className={`rounded-[2rem] p-6 border flex items-center gap-5 transition-all hover:shadow-md ${isApproved ? "bg-white border-emerald-100 cursor-pointer hover:border-emerald-300" : "bg-white border-slate-100 opacity-60 cursor-not-allowed"}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isApproved ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"}`}>
                  <QrCode size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Smart QR Pass</p>
                  <h4 className="text-base font-extrabold text-slate-800">{isApproved ? "View & Download" : "Locked"}</h4>
                </div>
              </button>

              <div className="bg-white rounded-[2rem] p-6 border border-sky-100 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                  <h4 className="text-3xl font-extrabold text-slate-800">{bookings.length.toString().padStart(2, "0")}</h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── FINANCIAL LEDGER ─── */}
          <motion.div variants={item} className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden mt-6">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Booking History</h3>
                <p className="text-xs font-medium text-slate-400 mt-1">All your payment & accommodation records</p>
              </div>
              <button onClick={() => navigate("/home")} className="hidden md:flex bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md">
                + New Booking
              </button>
            </div>

            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <FileText size={40} className="mx-auto mb-3 text-slate-200" />
                    <p className="font-bold text-slate-400">No bookings yet.</p>
                    <button onClick={() => navigate("/home")} className="mt-4 text-sky-500 font-bold text-sm hover:underline">
                      Explore Hostels →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b, index) => (
                    <LedgerRow
                      key={b.id || index}
                      id={b.id}
                      date={b.date}
                      item={`${b.hostelName || "Sahyadri"} — ${b.purpose || "Guest Room"}`}
                      amount={`₹${b.amount || "450"}`}
                      bookingStatus={b.bookingStatus}
                      roomNumber={b.roomNumber}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* ─── QR MODAL ─── */}
      {showQR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-sky-100 text-center relative"
          >
            <button onClick={() => setShowQR(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 transition-colors">
              <X size={18} />
            </button>
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-1">Smart Gate Pass</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Scan at main gate for entry</p>

            {/* QR Placeholder */}
            <div className="w-48 h-48 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-slate-200 relative overflow-hidden">
              <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-40 h-40 opacity-80">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`${Math.random() > 0.5 ? "bg-slate-800" : "bg-white"} rounded-[1px]`} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                  <Building2 size={16} className="text-sky-500" />
                </div>
              </div>
            </div>

            <div className="bg-sky-50 rounded-2xl p-4 text-left space-y-2 mb-6 border border-sky-100">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">DU Ref</span>
                <span className="font-mono font-black text-sky-600">{latestBooking?.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Room</span>
                <span className="font-bold text-slate-800">{latestBooking?.roomNumber} — {latestBooking?.hostelName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Check-in</span>
                <span className="font-bold text-slate-800">{latestBooking?.checkin?.split("—")[0]}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Valid till</span>
                <span className="font-bold text-slate-800">{latestBooking?.checkout?.split("—")[0]}</span>
              </div>
            </div>

            <button
              onClick={() => { toast.success("QR Pass saved to device!"); }}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              <Download size={16} /> Download QR Pass
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── HELPER COMPONENTS ───

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"}`}>
      {icon} <span className="tracking-wide">{label}</span>
    </button>
  );
}

function TrackerStep({ icon, title, desc, status }) {
  const isDone = status === "done";
  const isActive = status === "active";
  const isRejected = status === "rejected";
  return (
    <div className="flex flex-col items-center relative z-10 w-full md:w-auto mb-6 md:mb-0">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm border-2 transition-colors ${isDone ? "bg-emerald-400 text-white border-emerald-400" : isActive ? "bg-white text-sky-500 border-sky-400 shadow-sky-200" : isRejected ? "bg-rose-100 text-rose-400 border-rose-200" : "bg-slate-50 text-slate-300 border-slate-100"}`}>
        {icon}
      </div>
      <h4 className={`font-extrabold text-sm ${isDone || isActive ? "text-slate-800" : isRejected ? "text-rose-400" : "text-slate-400"}`}>{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">{desc}</p>
    </div>
  );
}

function LedgerRow({ id, date, item, amount, bookingStatus, roomNumber }) {
  const statusConfig = {
    pending: { label: "Pending Approval", class: "bg-amber-50 text-amber-600 border-amber-100" },
    approved: { label: "Approved ✅", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    rejected: { label: "Rejected", class: "bg-rose-50 text-rose-600 border-rose-100" },
  };
  const s = statusConfig[bookingStatus] || statusConfig.pending;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 transition-colors group">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{item}</h4>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Ref: <span className="font-mono text-slate-400">{id}</span>
            {roomNumber && <span className="ml-2 text-sky-600 font-bold">• Room {roomNumber}</span>}
            {date && <span className="ml-2">• {date}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        <div className="text-left md:text-right">
          <p className="font-black text-slate-800">{amount}</p>
          <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.class}`}>
            {s.label}
          </span>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm">
          <Download size={14} /> Receipt
        </button>
      </div>
    </div>
  );
}