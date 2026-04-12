import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,  QrCode, LogOut, Settings, Home as HomeIcon,
  Building2, Bell, CalendarCheck, BadgeCheck, Siren, Download,
  CheckCircle2, Clock, FileText, Activity, AlertCircle, X, RefreshCw
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest Scholar" };

  useEffect(() => {
    fetchMyBookings();
    // 🔥 THE FIX: Poll every 5s so Rector approval reflects immediately
    const interval = setInterval(() => {
      fetchMyBookings(true); // silent = don't show loading spinner on auto-refresh
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyBookings = async (silent = false) => {
    try {
      const res = await API.get("/api/book/my");
      setBookings(res.data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("MyBookings fetch failed:", err.message);
      if (err?.response?.status === 401) navigate("/login");
      setBookings([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  // 🔥 THE FIX: check both paymentStatus and status fields
  const latestBooking = bookings[0] || null;
  const actualStatus = latestBooking?.paymentStatus || latestBooking?.status;
  const isApproved = actualStatus === "approved";
  const isPending  = actualStatus === "pending";
  const isRejected = actualStatus === "rejected";

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-extrabold text-sky-600 uppercase tracking-widest bg-slate-50 text-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
        Syncing your bookings...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
      <Toaster position="top-right" />

      {/* ─── SIDEBAR ─── */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col justify-between py-6 border-r border-slate-100 fixed top-0 left-0 h-screen z-40">
        <div className="px-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-800 leading-none tracking-tight">StayPG</p>
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Institutional</p>
            </div>
          </div>
          <nav className="space-y-0.5">
            <SidebarItem icon={<HomeIcon size={17} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <SidebarItem icon={<User size={17} />} label="My Profile" onClick={() => navigate("/complete-profile")} />
            <SidebarItem icon={<Building2 size={17} />} label="Explore Hostels" onClick={() => navigate("/home")} />
            <SidebarItem icon={<CalendarCheck size={17} />} label="My Bookings" active onClick={() => navigate("/my-bookings")} />
            <SidebarItem icon={<BadgeCheck size={17} />} label="Verify Pass" onClick={() => navigate("/verify-payment")} />
          </nav>
        </div>
        <div className="px-5 space-y-0.5 border-t border-slate-100 pt-4">
          <button onClick={() => navigate("/sos")} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 mb-1">
            <Siren size={17} className="animate-pulse" /> SOS Emergency
          </button>
          <SidebarItem icon={<Settings size={17} />} label="Settings" onClick={() => navigate("/settings")} />
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">

        <header className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-1">My Bookings</h1>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Application Track Record</p>
              <button onClick={() => fetchMyBookings()} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-sky-500 uppercase tracking-widest transition-colors">
                <RefreshCw size={11} /> Refresh
              </button>
              <span className="text-[10px] text-slate-300 font-bold">Updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </motion.div>
          <div className="flex gap-2">
            <button className="w-11 h-11 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all relative">
              <Bell size={18} />
              {isPending && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" />}
            </button>
            <div onClick={() => navigate("/complete-profile")} className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-sky-200 transition-all">
              <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center font-extrabold text-sm">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="text-sm font-bold text-slate-700">{user.name?.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show" className="space-y-5">

          {/* ─── STATUS BANNER ─── */}
          {latestBooking && (
            <motion.div variants={item}>
              {isPending && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-amber-800">Awaiting Rector Approval</p>
                    <p className="text-xs text-amber-600 mt-0.5">DU Ref: <span className="font-mono font-extrabold">{latestBooking.duNumber}</span> — Receipt uploaded. Rector is reviewing your request.</p>
                  </div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse mt-2 flex-shrink-0" />
                </div>
              )}
              {isApproved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-emerald-800">✅ Room Approved! Welcome to {latestBooking.hostelName || "Sahyadri"} Hostel</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Room {latestBooking.roomNumber} · Check-in: {formatDate(latestBooking.checkInTime)} · Check-out: {formatDate(latestBooking.checkOutTime)}</p>
                  </div>
                </div>
              )}
              {isRejected && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={18} className="text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-rose-800">Request Rejected</p>
                    <p className="text-xs text-rose-600 mt-0.5">Please contact the Rector's office or try booking again.</p>
                  </div>
                  <button onClick={() => navigate("/home")} className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-2 rounded-xl hover:bg-rose-200 transition-colors whitespace-nowrap">
                    Book Again →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── JOURNEY TRACKER ─── */}
          <motion.div variants={item} className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-56 h-56 bg-sky-50 rounded-full blur-[60px] opacity-60 -z-10" />
            <h2 className="text-lg font-extrabold text-slate-800 mb-7 flex items-center gap-2">
              <Activity size={20} className="text-sky-500" /> Application Progress
            </h2>
            <div className="flex flex-col md:flex-row justify-between relative">
              <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-slate-100 -z-10" />
              <div className={`hidden md:block absolute top-6 left-10 h-0.5 -z-10 bg-emerald-400 transition-all duration-700 ${isApproved ? "right-10" : isPending ? "right-[50%]" : "right-[75%]"}`} />
              <TrackerStep icon={<FileText size={19} />} title="Applied" desc="Submitted" status="done" />
              <TrackerStep icon={<BadgeCheck size={19} />} title="Payment" desc="Verified" status="done" />
              <TrackerStep icon={<Building2 size={19} />} title="Room Allocated"
                desc={isApproved ? `${latestBooking?.hostelName || "Sahyadri"} · ${latestBooking?.roomNumber}` : isPending ? "Pending" : isRejected ? "Rejected" : "Awaiting"}
                status={isApproved ? "done" : isRejected ? "rejected" : "active"} />
              <TrackerStep icon={<QrCode size={19} />} title="Check-in"
                desc={isApproved ? "QR Pass Ready" : "Waiting"}
                status={isApproved ? "active" : "pending"} />
            </div>
          </motion.div>

          {/* ─── MAIN BOOKING CARD ─── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <motion.div variants={item}
              className={`md:col-span-8 rounded-[2rem] p-7 relative overflow-hidden shadow-xl border flex flex-col justify-between min-h-[200px] ${isApproved ? "bg-gradient-to-br from-sky-500 to-teal-400 border-sky-400 shadow-sky-500/20" : "bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500 shadow-slate-500/20"}`}>
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full blur-[70px] opacity-20 pointer-events-none" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mb-2">
                    {isApproved ? "Active Stay" : isPending ? "Pending Review" : isRejected ? "Request Rejected" : "No Active Booking"}
                  </p>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {isApproved ? (latestBooking?.hostelName || "Sahyadri") : isPending ? "Under Review" : "Book a Room"}
                  </h3>
                  <p className="text-sm text-white/70 font-medium mt-1">SGGSIE&T Campus, Nanded</p>
                </div>
                <div className={`backdrop-blur-md px-4 py-2 rounded-xl border flex items-center gap-2 ${isApproved ? "bg-white/20 border-white/30" : "bg-white/10 border-white/20"}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${isApproved ? "bg-emerald-400" : isPending ? "bg-amber-400" : "bg-rose-400"}`} />
                  <span className="text-xs font-extrabold text-white uppercase tracking-widest">
                    {isApproved ? "Approved" : isPending ? "Pending" : isRejected ? "Rejected" : "None"}
                  </span>
                </div>
              </div>
              <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                <div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Room No.</p>
                  <p className="text-lg font-extrabold text-white">{isApproved ? latestBooking?.roomNumber : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Check-in</p>
                  <p className="text-sm font-extrabold text-white">{isApproved ? formatDate(latestBooking?.checkInTime) : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Check-out</p>
                  <p className="text-sm font-extrabold text-white">{isApproved ? formatDate(latestBooking?.checkOutTime) : "—"}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="md:col-span-4 grid grid-rows-2 gap-5">
              <button onClick={() => { if (isApproved) setShowQR(latestBooking?._id); else toast.error("QR Pass available after Rector approval!"); }}
                className={`rounded-[2rem] p-5 border flex items-center gap-4 transition-all hover:shadow-md ${isApproved ? "bg-white border-emerald-100 cursor-pointer hover:border-emerald-300" : "bg-white border-slate-100 opacity-60 cursor-not-allowed"}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isApproved ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"}`}>
                  <QrCode size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Smart QR Pass</p>
                  <h4 className="text-base font-extrabold text-slate-800">{isApproved ? "View & Download" : "Locked"}</h4>
                </div>
              </button>

              <div className="bg-white rounded-[2rem] p-5 border border-sky-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                  <h4 className="text-3xl font-extrabold text-slate-800">{bookings.length.toString().padStart(2, "0")}</h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── BOOKING HISTORY ─── */}
          <motion.div variants={item} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Booking History</h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">All payment & accommodation records</p>
              </div>
              <button onClick={() => navigate("/home")} className="hidden md:flex bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md">
                + New Booking
              </button>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-14">
                  <FileText size={40} className="mx-auto mb-3 text-slate-200" />
                  <p className="font-extrabold text-slate-400">No bookings yet.</p>
                  <button onClick={() => navigate("/home")} className="mt-4 text-sky-500 font-extrabold text-sm hover:underline">Explore Hostels →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b, index) => (
                    <LedgerRow key={b._id || index}
                      id={b.duNumber}
                      date={new Date(b.createdAt).toLocaleDateString("en-IN")}
                      item={`${b.hostelName || "Sahyadri"} — Room ${b.roomNumber || "Pending"}`}
                      amount={`₹${b.room?.pricePerDay || 450}`}
                      bookingStatus={b.paymentStatus || b.status}
                      roomNumber={b.roomNumber} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* ─── QR MODAL ─── */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-sky-100 text-center relative">
              <button onClick={() => setShowQR(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 transition-colors">
                <X size={17} />
              </button>
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-1">Smart Gate Pass</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Scan at main gate for entry</p>

              <div className="w-44 h-44 bg-slate-50 border-2 border-slate-100 rounded-2xl mx-auto mb-5 flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-36 h-36 opacity-80">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`${Math.random() > 0.5 ? "bg-slate-800" : "bg-white"} rounded-[1px]`} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                    <Building2 size={15} className="text-sky-500" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2.5 mb-5 border border-slate-100">
                <QRField label="DU Ref" value={latestBooking?.duNumber} mono />
                <QRField label="Room" value={`${latestBooking?.roomNumber} — ${latestBooking?.hostelName || "Sahyadri"}`} />
                <QRField label="Check-in" value={formatDate(latestBooking?.checkInTime)} />
                <QRField label="Valid till" value={formatDate(latestBooking?.checkOutTime)} />
              </div>

              <button onClick={() => { toast.success("QR Pass saved to device!"); }}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2">
                <Download size={15} /> Download QR Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QRField({ label, value, mono }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="font-bold text-slate-500">{label}</span>
      <span className={`font-extrabold text-slate-800 ${mono ? "font-mono text-sky-600" : ""}`}>{value || "—"}</span>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
      {icon} <span className="tracking-wide">{label}</span>
    </button>
  );
}

function TrackerStep({ icon, title, desc, status }) {
  const isDone = status === "done";
  const isActive = status === "active";
  const isRejected = status === "rejected";
  return (
    <div className="flex flex-col items-center relative z-10 w-full md:w-auto mb-5 md:mb-0">
      <div className={`w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm border-2 transition-colors ${isDone ? "bg-emerald-400 text-white border-emerald-400" : isActive ? "bg-white text-sky-500 border-sky-400 shadow-sky-200" : isRejected ? "bg-rose-100 text-rose-400 border-rose-200" : "bg-slate-50 text-slate-300 border-slate-100"}`}>
        {icon}
      </div>
      <h4 className={`font-extrabold text-sm ${isDone || isActive ? "text-slate-800" : isRejected ? "text-rose-400" : "text-slate-400"}`}>{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 text-center">{desc}</p>
    </div>
  );
}

function LedgerRow({ id, date, item, amount, bookingStatus, roomNumber }) {
  const statusConfig = {
    pending:  { label: "Pending Approval",  class: "bg-amber-50 text-amber-600 border-amber-100" },
    approved: { label: "Approved ✅",        class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    rejected: { label: "Rejected",           class: "bg-rose-50 text-rose-600 border-rose-100" },
  };
  const s = statusConfig[bookingStatus] || statusConfig.pending;
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-colors group">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText size={18} />
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 text-sm">{item}</h4>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Ref: <span className="font-mono text-slate-400">{id}</span>
            {date && <span className="ml-2">· {date}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <div className="text-left md:text-right">
          <p className="font-extrabold text-slate-800 text-sm">{amount}</p>
          <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${s.class}`}>{s.label}</span>
        </div>
        <button className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-500 hover:text-sky-600 hover:border-sky-100 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm">
          <Download size={13} /> Receipt
        </button>
      </div>
    </div>
  );
}