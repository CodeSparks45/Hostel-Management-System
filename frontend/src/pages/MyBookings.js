// ============================================================
// MyBookings.js
// ============================================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode, Building2, Bell, CalendarCheck, BadgeCheck, Download,
  CheckCircle2, Clock, FileText, Activity, AlertCircle, X, RefreshCw
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";
import MobileNav from "./MobileNav";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showQR, setShowQR]           = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest Scholar" };

  useEffect(() => {
    fetchMyBookings();
    const interval = setInterval(() => fetchMyBookings(true), 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyBookings = async (silent = false) => {
    try {
      const res = await API.get("/api/book/my");
      setBookings(res.data);
      setLastRefresh(new Date());
    } catch (err) {
      if (err?.response?.status === 401) navigate("/login");
      setBookings([]);
    } finally { if (!silent) setLoading(false); }
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const latestBooking = bookings[0] || null;
  const actualStatus  = latestBooking?.paymentStatus || latestBooking?.status;
  const isApproved    = actualStatus === "approved";
  const isPending     = actualStatus === "pending";
  const isRejected    = actualStatus === "rejected";
  const formatDate    = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "—";

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"/>
        <p className="text-sm font-extrabold text-sky-600 uppercase tracking-widest">Syncing bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Toaster position="top-right"/>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-none">My Bookings</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Track Record</p>
              <button onClick={()=>fetchMyBookings()} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-sky-500 uppercase transition-colors">
                <RefreshCw size={10}/> {lastRefresh.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 relative">
              <Bell size={17}/>
              {isPending&&<span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full border-2 border-white"/>}
            </button>
            <div onClick={()=>navigate("/complete-profile")} className="w-10 h-10 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center font-extrabold text-sm cursor-pointer">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-5 space-y-4">

        {/* Status banner */}
        {latestBooking && (
          <motion.div variants={item} initial="hidden" animate="show">
            {isPending&&<div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 flex items-start gap-3"><div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock size={16} className="text-amber-600"/></div><div><p className="font-extrabold text-amber-800 text-sm">Awaiting Rector Approval</p><p className="text-xs text-amber-600 mt-0.5">DU Ref: <span className="font-mono font-extrabold">{latestBooking.duNumber}</span> — Under review.</p></div></div>}
            {isApproved&&<div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5 flex items-start gap-3"><div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><CheckCircle2 size={16} className="text-emerald-600"/></div><div><p className="font-extrabold text-emerald-800 text-sm">✅ Room Approved — {latestBooking.hostelName||"Sahyadri"}</p><p className="text-xs text-emerald-600 mt-0.5">Room {latestBooking.roomNumber} · Check-in: {formatDate(latestBooking.checkInTime)}</p></div></div>}
            {isRejected&&<div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3.5 flex items-start gap-3"><div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0"><AlertCircle size={16} className="text-rose-600"/></div><div className="flex-1"><p className="font-extrabold text-rose-800 text-sm">Request Rejected</p><p className="text-xs text-rose-600 mt-0.5">Contact Rector's office or try booking again.</p></div><button onClick={()=>navigate("/home")} className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-2 rounded-xl whitespace-nowrap">Rebook →</button></div>}
          </motion.div>
        )}

        {/* Journey tracker */}
        <motion.div variants={item} initial="hidden" animate="show" className="bg-white rounded-[1.75rem] p-5 sm:p-7 border border-slate-100 shadow-sm overflow-hidden relative">
          <h2 className="text-base font-extrabold text-slate-800 mb-6 flex items-center gap-2"><Activity size={18} className="text-sky-500"/> Application Progress</h2>
          <div className="flex flex-col sm:flex-row justify-between relative">
            <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-slate-100 -z-10"/>
            <div className={`hidden sm:block absolute top-5 left-8 h-0.5 -z-10 bg-emerald-400 transition-all duration-700 ${isApproved?"right-8":isPending?"right-[50%]":"right-[75%]"}`}/>
            <TrackerStep icon={<FileText size={17}/>} title="Applied" desc="Submitted" status="done"/>
            <TrackerStep icon={<BadgeCheck size={17}/>} title="Payment" desc="Verified" status="done"/>
            <TrackerStep icon={<Building2 size={17}/>} title="Room Allocated" desc={isApproved?`${latestBooking?.hostelName||"Sahyadri"} · ${latestBooking?.roomNumber}`:isPending?"Pending":isRejected?"Rejected":"Awaiting"} status={isApproved?"done":isRejected?"rejected":"active"}/>
            <TrackerStep icon={<QrCode size={17}/>} title="Check-in" desc={isApproved?"QR Pass Ready":"Waiting"} status={isApproved?"active":"pending"}/>
          </div>
        </motion.div>

        {/* Main booking card */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <motion.div variants={item} initial="hidden" animate="show"
            className={`sm:col-span-8 rounded-[1.75rem] p-6 relative overflow-hidden shadow-xl border flex flex-col justify-between min-h-[180px] ${isApproved?"bg-gradient-to-br from-sky-500 to-teal-400 border-sky-400 shadow-sky-500/20":"bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500 shadow-slate-500/20"}`}>
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-white rounded-full blur-[70px] opacity-20 pointer-events-none"/>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.25em] mb-2">{isApproved?"Active Stay":isPending?"Pending Review":isRejected?"Request Rejected":"No Active Booking"}</p>
                <h3 className="text-xl font-extrabold text-white">{isApproved?(latestBooking?.hostelName||"Sahyadri"):isPending?"Under Review":"Book a Room"}</h3>
                <p className="text-sm text-white/70 font-medium mt-0.5">SGGSIE&T Campus, Nanded</p>
              </div>
              <div className={`backdrop-blur-md px-3 py-2 rounded-xl border flex items-center gap-2 ${isApproved?"bg-white/20 border-white/30":"bg-white/10 border-white/20"}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${isApproved?"bg-emerald-400":isPending?"bg-amber-400":"bg-rose-400"}`}/>
                <span className="text-xs font-extrabold text-white uppercase">{isApproved?"Approved":isPending?"Pending":isRejected?"Rejected":"None"}</span>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-3 gap-3 mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <div><p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Room</p><p className="text-lg font-extrabold text-white">{isApproved?latestBooking?.roomNumber:"—"}</p></div>
              <div><p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Check-in</p><p className="text-sm font-extrabold text-white">{isApproved?formatDate(latestBooking?.checkInTime):"—"}</p></div>
              <div><p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Check-out</p><p className="text-sm font-extrabold text-white">{isApproved?formatDate(latestBooking?.checkOutTime):"—"}</p></div>
            </div>
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show" className="sm:col-span-4 grid grid-rows-2 gap-4">
            <button onClick={()=>{if(isApproved)setShowQR(latestBooking?._id);else toast.error("QR Pass available after approval!");}}
              className={`rounded-[1.75rem] p-5 border flex items-center gap-4 transition-all hover:shadow-md ${isApproved?"bg-white border-emerald-100 cursor-pointer hover:border-emerald-300":"bg-white border-slate-100 opacity-60 cursor-not-allowed"}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isApproved?"bg-emerald-50 text-emerald-500":"bg-slate-50 text-slate-400"}`}><QrCode size={22}/></div>
              <div className="text-left"><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Smart QR Pass</p><h4 className="text-base font-extrabold text-slate-800">{isApproved?"View & Download":"Locked"}</h4></div>
            </button>
            <div className="bg-white rounded-[1.75rem] p-5 border border-sky-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0"><CalendarCheck size={22}/></div>
              <div><p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p><h4 className="text-3xl font-extrabold text-slate-800">{bookings.length.toString().padStart(2,"0")}</h4></div>
            </div>
          </motion.div>
        </div>

        {/* Booking history */}
        <motion.div variants={item} initial="hidden" animate="show" className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div><h3 className="font-extrabold text-slate-800 text-base">Booking History</h3><p className="text-xs font-medium text-slate-400 mt-0.5">All payment & accommodation records</p></div>
            <button onClick={()=>navigate("/home")} className="bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-slate-900 transition-all">+ New</button>
          </div>
          <div className="p-5">
            {bookings.length===0 ? (
              <div className="text-center py-12"><FileText size={36} className="mx-auto mb-3 text-slate-200"/><p className="font-extrabold text-slate-400">No bookings yet.</p><button onClick={()=>navigate("/home")} className="mt-4 text-sky-500 font-bold text-sm">Explore Hostels →</button></div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b,i)=>{
                  const s = b.paymentStatus||b.status;
                  const cfg = { pending:{label:"Pending",cls:"bg-amber-50 text-amber-600 border-amber-100"}, approved:{label:"Approved ✅",cls:"bg-emerald-50 text-emerald-600 border-emerald-100"}, rejected:{label:"Rejected",cls:"bg-rose-50 text-rose-600 border-rose-100"} }[s]||{label:"Pending",cls:"bg-amber-50 text-amber-600 border-amber-100"};
                  return (
                    <div key={b._id||i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-colors">
                      <div className="flex items-center gap-3 mb-3 sm:mb-0">
                        <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center flex-shrink-0"><FileText size={17}/></div>
                        <div><h4 className="font-extrabold text-slate-800 text-sm">{b.hostelName||"Sahyadri"} — Room {b.roomNumber||"Pending"}</h4><p className="text-xs font-medium text-slate-500 mt-0.5">Ref: <span className="font-mono text-slate-400">{b.duNumber}</span> · {new Date(b.createdAt).toLocaleDateString("en-IN")}</p></div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="font-extrabold text-slate-800 text-sm">₹{b.room?.pricePerDay||450}</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${cfg.cls}`}>{cfg.label}</span>
                        </div>
                        <button onClick={() => toast.success("Receipt downloading...")} className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-500 hover:text-sky-600 hover:border-sky-100 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                          <Download size={12}/> Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

      </main>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              className="bg-white rounded-[2.5rem] p-7 max-w-sm w-full shadow-2xl border border-sky-100 text-center relative">
              <button onClick={()=>setShowQR(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400"><X size={16}/></button>
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><QrCode size={26}/></div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-1">Smart Gate Pass</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Scan at main gate for entry</p>
              <div className="w-40 h-40 bg-slate-50 border-2 border-slate-100 rounded-2xl mx-auto mb-5 flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-32 h-32 opacity-80">
                  {Array.from({length:64}).map((_,i)=><div key={i} className={`${Math.random()>0.5?"bg-slate-800":"bg-white"} rounded-[1px]`}/>)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm"><Building2 size={14} className="text-sky-500"/></div></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-5 border border-slate-100">
                {[{l:"DU Ref",v:latestBooking?.duNumber,mono:true},{l:"Room",v:`${latestBooking?.roomNumber} — ${latestBooking?.hostelName||"Sahyadri"}`},{l:"Check-in",v:formatDate(latestBooking?.checkInTime)},{l:"Valid till",v:formatDate(latestBooking?.checkOutTime)}].map((row,i)=>(
                  <div key={i} className="flex justify-between text-xs"><span className="font-bold text-slate-500">{row.l}</span><span className={`font-extrabold text-slate-800 ${row.mono?"font-mono text-sky-600":""}`}>{row.v||"—"}</span></div>
                ))}
              </div>
              <button onClick={()=>toast.success("QR Pass saved!")} className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2">
                <Download size={14}/> Download QR Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MobileNav/>
    </div>
  );
}

function TrackerStep({ icon, title, desc, status }) {
  const isDone=status==="done", isActive=status==="active", isRejected=status==="rejected";
  return (
    <div className="flex flex-col items-center relative z-10 w-full sm:w-auto mb-5 sm:mb-0">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm border-2 ${isDone?"bg-emerald-400 text-white border-emerald-400":isActive?"bg-white text-sky-500 border-sky-400 shadow-sky-200":isRejected?"bg-rose-100 text-rose-400 border-rose-200":"bg-slate-50 text-slate-300 border-slate-100"}`}>{icon}</div>
      <h4 className={`font-extrabold text-sm ${isDone||isActive?"text-slate-800":isRejected?"text-rose-400":"text-slate-400"}`}>{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 text-center">{desc}</p>
    </div>
  );
}