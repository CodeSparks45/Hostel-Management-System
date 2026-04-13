import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CheckCircle, Search, Filter,
  ShieldCheck, Building2, Check, X, LogOut, Settings, Clock,
  DoorOpen, UserCheck, ShieldAlert, FileText, Download, Briefcase,
  Mail, Eye, Activity, Zap, Timer, Menu, Map
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";
import MobileNav from "./MobileNav";

export default function RectorDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView]   = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests]       = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [rooms] = useState([
    { number:"A4",  hostel:"Sahyadri Boys", type:"AC",     occupied:1, capacity:1, status:"Full"      },
    { number:"A10", hostel:"Sahyadri Boys", type:"AC",     occupied:0, capacity:1, status:"Available" },
    { number:"B4",  hostel:"Sahyadri Boys", type:"AC",     occupied:0, capacity:1, status:"Available" },
    { number:"B10", hostel:"Sahyadri Boys", type:"AC",     occupied:1, capacity:1, status:"Full"      },
    { number:"A8",  hostel:"Sahyadri Boys", type:"Non-AC", occupied:0, capacity:1, status:"Available" },
    { number:"A9",  hostel:"Sahyadri Boys", type:"Non-AC", occupied:1, capacity:1, status:"Full"      },
    { number:"B8",  hostel:"Sahyadri Boys", type:"Non-AC", occupied:0, capacity:1, status:"Available" },
    { number:"B9",  hostel:"Sahyadri Boys", type:"Non-AC", occupied:0, capacity:1, status:"Available" },
    { number:"A9",  hostel:"Krishna Girls", type:"Non-AC", occupied:1, capacity:1, status:"Full"      },
    { number:"A10", hostel:"Krishna Girls", type:"Non-AC", occupied:0, capacity:1, status:"Available" },
  ]);

  const [guests] = useState([
    { id:"EMP-2041", name:"Prof. Arvind Kumar",  designation:"Faculty",         hostel:"Sahyadri Boys", room:"A4",  status:"In Campus", checkin:"10 Apr 2026", checkout:"12 Apr 2026" },
    { id:"GST-9921", name:"Mr. Ramesh Desai",    designation:"Official Guest",  hostel:"Sahyadri Boys", room:"B4",  status:"In Campus", checkin:"10 Apr 2026", checkout:"11 Apr 2026" },
    { id:"EMP-1102", name:"Dr. Sneha Rao",       designation:"Principal Office",hostel:"Krishna Girls", room:"A9",  status:"On Leave",  checkin:"08 Apr 2026", checkout:"09 Apr 2026" },
  ]);

  useEffect(() => {
    fetchPendingBookings();
    fetchApprovedBookings();
    const interval  = setInterval(fetchPendingBookings, 10000);
    const interval2 = setInterval(fetchApprovedBookings, 30000);
    const timer     = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(interval); clearInterval(interval2); clearInterval(timer); };
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const res = await API.get("/api/book/all?status=pending");
      setRequests(res.data.map(b => ({
        id:          b._id,
        duNumber:    b.duNumber,
        name:        b.user?.name    || "Unknown",
        email:       b.user?.email   || "",
        designation: b.user?.role    || "Student",
        date:        new Date(b.createdAt).toLocaleString("en-IN"),
        receipt:     b.receiptUrl    || null,
        amount:      b.room?.pricePerDay || 450,
        hostelName:  b.hostelName,
      })));
    } catch { setRequests([]); }
  };

  const fetchApprovedBookings = async () => {
    try {
      const res = await API.get("/api/book/all?status=approved");
      setApprovedBookings(res.data);
    } catch {}
  };

  const handleApprove = async (mongoId) => {
    try {
      const res = await API.patch(`/api/book/approve/${mongoId}`);
      toast.custom((t) => (
        <div className={`${t.visible?"animate-enter":"animate-leave"} max-w-md w-full bg-white shadow-xl rounded-2xl flex border border-emerald-100 p-4`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail size={18} className="text-emerald-600"/></div>
            <div>
              <p className="text-sm font-extrabold text-slate-800">✅ {res.data.booking?.user?.name} — Approved!</p>
              <p className="text-xs text-slate-500 mt-1">Room <strong>{res.data.booking?.roomNumber}</strong> — {res.data.booking?.hostelName}<br/>{res.data.message}</p>
            </div>
          </div>
          <button onClick={()=>toast.dismiss(t.id)} className="ml-auto text-slate-400 hover:text-slate-600 pl-2">✕</button>
        </div>
      ), { duration: 8000 });
      setRequests(prev => prev.filter(r => r.id !== mongoId));
    } catch (err) { toast.error(err?.response?.data?.message || "Approval failed."); }
  };

  const handleReject = async (mongoId) => {
    const reason = window.prompt("Rejection reason (user will receive email):", "Documents could not be verified.");
    try {
      await API.patch(`/api/book/reject/${mongoId}`, { reason: reason || "Rejected by Rector." });
      toast.error("❌ Rejected. Email sent to user.");
      setRequests(prev => prev.filter(r => r.id !== mongoId));
    } catch (err) { toast.error(err?.response?.data?.message || "Rejection failed."); }
  };

  const getRemainingTime = (checkoutTime) => {
    if (!checkoutTime) return null;
    const remaining = Math.max(0, Math.floor((new Date(checkoutTime) - currentTime) / 1000));
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const totalRooms     = rooms.length;
  const availableRooms = rooms.filter(r => r.status === "Available").length;
  const occupiedRooms  = rooms.filter(r => r.status === "Full").length;

  const NavItems = ({ onNav }) => (
    <>
      {[
        { icon:<Map size={17}/>,         label:"Overview",          view:"Overview"  },
        { icon:<AlertTriangle size={17}/>,label:"Verifications",    view:"Requests"  },
        { icon:<Briefcase size={17}/>,    label:"Staff / Logbook",  view:"Logbook"   },
        { icon:<DoorOpen size={17}/>,     label:"Room Matrix",      view:"Rooms"     },
        { icon:<Timer size={17}/>,        label:"Live Timers",      view:"Timers"    },
      ].map(({ icon, label, view }) => (
        <button key={view} onClick={()=>{ setActiveView(view); onNav(); }}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${activeView===view?"bg-sky-500 text-white shadow-md shadow-sky-500/20":"text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
          <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
          {view==="Requests" && requests.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeView===view?"bg-white text-sky-600":"bg-rose-500 text-white"}`}>{requests.length}</span>
          )}
        </button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
      <Toaster position="top-right"/>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"/>
            <motion.aside initial={{x:-290}} animate={{x:0}} exit={{x:-290}} transition={{type:"spring",damping:28}}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[70] flex flex-col shadow-2xl lg:hidden p-5">
              <button onClick={()=>setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400"><X size={20}/></button>
              <div className="flex items-center gap-3 mb-8 mt-2">
                <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20"><Building2 size={19} className="text-white"/></div>
                <div><p className="text-base font-extrabold text-slate-800 leading-none">StayPG Admin</p><p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Rector Console</p></div>
              </div>
              <nav className="space-y-0.5"><NavItems onNav={()=>setSidebarOpen(false)}/></nav>
              <div className="mt-auto pt-4 border-t border-slate-100 space-y-0.5">
                <button onClick={()=>{localStorage.clear();navigate("/login");}} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all">
                  <LogOut size={17}/> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col justify-between py-6 border-r border-slate-100 fixed top-0 left-0 h-screen z-50">
        <div className="px-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20"><Building2 size={19} className="text-white"/></div>
            <div><p className="text-base font-extrabold text-slate-800 leading-none">StayPG Admin</p><p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Rector Console</p></div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl mb-5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"/>
            <span className="text-xs font-bold text-slate-600">{currentTime.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
            <span className="text-slate-300 text-xs ml-1">|</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Live</span>
          </div>
          <nav className="space-y-0.5"><NavItems onNav={()=>{}}/></nav>
        </div>
        <div className="px-5 space-y-0.5 border-t border-slate-100 pt-4">
          <button onClick={()=>toast("Guard interface locked.")} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all">
            <ShieldAlert size={17}/> Campus Guards
          </button>
          <button onClick={()=>{localStorage.clear();navigate("/login");}} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all">
            <LogOut size={17}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-[260px] pb-20 lg:pb-0 min-w-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-5 lg:p-10">

          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button onClick={()=>setSidebarOpen(true)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shadow-sm"><Menu size={20}/></button>
              <div><p className="text-base font-extrabold text-slate-800 leading-none">Rector Dashboard</p><p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-0.5">SGGSIE&T Admin</p></div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-100 px-3 py-2.5 rounded-xl shadow-sm">
              <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-extrabold text-sm">SD</div>
              <div className="hidden sm:block"><p className="text-xs font-extrabold text-slate-800 leading-none">S.R. Deshmukh</p><p className="text-[9px] font-bold text-emerald-500 uppercase">Chief Rector</p></div>
            </div>
          </div>

          {/* Desktop header */}
          <header className="hidden lg:flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Rector Dashboard</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">SGGSIE&T Hostel Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                  placeholder="Search DU Number or Name..."
                  className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-bold text-slate-700 shadow-sm w-64"/>
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center font-extrabold">SD</div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800 leading-none">Prof. S.R. Deshmukh</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-0.5"><ShieldCheck size={11}/> Chief Rector</p>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeView === "Overview" && (
              <motion.div key="overview" variants={fadeUp} initial="hidden" animate="show" exit={{opacity:0,y:-20}}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard label="In-House" value={guests.filter(g=>g.status==="In Campus").length.toString().padStart(2,"0")} icon={<UserCheck size={22} className="text-sky-500"/>} color="bg-sky-50 border-sky-100" trend="+2 today"/>
                  <StatCard label="Pending" value={requests.length.toString().padStart(2,"0")} icon={<Clock size={22} className="text-amber-500"/>} color="bg-amber-50 border-amber-100" trend="Action needed" urgent={requests.length>0}/>
                  <StatCard label="Rooms Free" value={availableRooms.toString().padStart(2,"0")} icon={<DoorOpen size={22} className="text-emerald-500"/>} color="bg-emerald-50 border-emerald-100" trend={`of ${totalRooms} total`}/>
                  <StatCard label="Occupancy" value={`${Math.round((occupiedRooms/totalRooms)*100)}%`} icon={<Activity size={22} className="text-teal-500"/>} color="bg-teal-50 border-teal-100" trend="Current rate"/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                      <div><h3 className="font-extrabold text-slate-800 text-lg">Action Required</h3><p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{requests.length} pending approvals</p></div>
                      <button onClick={()=>setActiveView("Requests")} className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">View All →</button>
                    </div>
                    <div className="p-5 space-y-3">
                      {requests.slice(0,3).map((req,i)=>(
                        <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-sky-200 hover:bg-sky-50/30 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"><FileText size={18}/></div>
                            <div><p className="font-extrabold text-slate-800 text-sm">{req.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{req.designation} · {req.duNumber}</p></div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={()=>handleApprove(req.id)} className="bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 flex items-center gap-1"><Check size={13}/> Approve</button>
                            <button onClick={()=>handleReject(req.id)} className="bg-white border border-rose-200 text-rose-500 px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 flex items-center gap-1"><X size={13}/> Reject</button>
                          </div>
                        </div>
                      ))}
                      {requests.length===0&&<div className="text-center py-10"><CheckCircle size={36} className="mx-auto mb-3 text-emerald-200"/><p className="font-extrabold text-slate-400">All requests processed!</p></div>}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/20 blur-[50px] rounded-full pointer-events-none"/>
                      <ShieldCheck size={32} className="text-sky-400 mb-4 relative z-10"/>
                      <h3 className="text-base font-extrabold mb-2 relative z-10">Campus Security</h3>
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 mb-4 relative z-10 border border-white/10">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/><span className="text-xs font-bold text-slate-300">Main Gate: Online</span>
                      </div>
                      <button onClick={()=>toast.success("Main Gate pinged! ✅")} className="w-full bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all relative z-10">
                        Ping Main Gate
                      </button>
                    </div>
                    <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
                      <h4 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2"><Zap size={14} className="text-amber-500"/> Room Snapshot</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Sahyadri Boys</span><span className="text-sky-600">{rooms.filter(r=>r.hostel==="Sahyadri Boys"&&r.status==="Available").length} free</span></div>
                        <div className="flex justify-between text-xs font-bold"><span className="text-slate-500">Krishna Girls</span><span className="text-sky-600">{rooms.filter(r=>r.hostel==="Krishna Girls"&&r.status==="Available").length} free</span></div>
                        <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-100"><span className="text-slate-500">Total Available</span><span className="text-emerald-600 font-extrabold">{availableRooms} / {totalRooms}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── VERIFICATION QUEUE ── */}
            {activeView === "Requests" && (
              <motion.div key="requests" variants={fadeUp} initial="hidden" animate="show" exit={{opacity:0,y:-20}}>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div><h3 className="font-extrabold text-slate-800 text-xl">Verification Queue</h3><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{requests.length} pending approval</p></div>
                    <button className="bg-slate-50 border border-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"><Filter size={13}/> Filter</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-slate-50">
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-5 py-4">DU Reference</th><th className="px-5 py-4">Identity</th><th className="px-5 py-4">Hostel</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Receipt</th><th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-bold text-slate-700">
                        {requests.length===0 ? (
                          <tr><td colSpan="6" className="text-center py-16"><CheckCircle size={40} className="mx-auto mb-3 text-emerald-200"/><p className="text-emerald-500 font-extrabold">Queue Empty ✅</p></td></tr>
                        ) : requests.filter(r=>r.name.toLowerCase().includes(searchQuery.toLowerCase())||(r.duNumber||"").toLowerCase().includes(searchQuery.toLowerCase())).map(req=>(
                          <tr key={req.id} className="border-b border-slate-50 hover:bg-sky-50/40 transition-colors">
                            <td className="px-5 py-4 font-mono text-xs text-sky-600 font-extrabold">{req.duNumber}</td>
                            <td className="px-5 py-4"><p className="font-extrabold text-slate-800">{req.name}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{req.designation}</p></td>
                            <td className="px-5 py-4 text-xs text-slate-600">{req.hostelName||"—"}</td>
                            <td className="px-5 py-4 text-xs text-slate-500 font-medium">{req.date}</td>
                            <td className="px-5 py-4">{req.receipt?<a href={req.receipt} target="_blank" rel="noreferrer" className="flex w-max items-center gap-1.5 text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 font-bold text-xs hover:bg-sky-100"><Eye size={12}/> View</a>:<span className="text-xs text-slate-400">No receipt</span>}</td>
                            <td className="px-5 py-4"><div className="flex justify-end gap-2">
                              <button onClick={()=>handleApprove(req.id)} className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20"><Check size={13}/> Approve</button>
                              <button onClick={()=>handleReject(req.id)} className="px-3 py-2.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1"><X size={13}/> Reject</button>
                            </div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── LOGBOOK ── */}
            {activeView === "Logbook" && (
              <motion.div key="logbook" variants={fadeUp} initial="hidden" animate="show" exit={{opacity:0,y:-20}}>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div><h3 className="font-extrabold text-slate-800 text-xl">Staff & Guest Logbook</h3><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Official Registry — {guests.length} Records</p></div>
                    <button onClick={()=>toast.success("Exporting CSV...")} className="bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-900 shadow-md"><Download size={14}/> Export</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-slate-50"><tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100"><th className="px-5 py-4">ID</th><th className="px-5 py-4">Name</th><th className="px-5 py-4">Hostel — Room</th><th className="px-5 py-4">Check-in</th><th className="px-5 py-4">Check-out</th><th className="px-5 py-4">Status</th></tr></thead>
                      <tbody className="text-sm font-bold text-slate-700">
                        {guests.filter(g=>g.name.toLowerCase().includes(searchQuery.toLowerCase())).map((g,i)=>(
                          <tr key={i} className="border-b border-slate-50 hover:bg-sky-50/40 transition-colors">
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{g.id}</td>
                            <td className="px-5 py-4"><p className="font-extrabold text-slate-800">{g.name}</p><p className="text-[10px] text-slate-400 uppercase">{g.designation}</p></td>
                            <td className="px-5 py-4"><p className="font-extrabold text-slate-700">Room {g.room}</p><p className="text-[10px] text-slate-400 font-bold">{g.hostel}</p></td>
                            <td className="px-5 py-4 text-xs text-slate-600">{g.checkin||"—"}</td>
                            <td className="px-5 py-4 text-xs text-slate-600">{g.checkout||"—"}</td>
                            <td className="px-5 py-4"><span className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border ${g.status==="In Campus"?"bg-emerald-50 text-emerald-600 border-emerald-100":"bg-rose-50 text-rose-600 border-rose-100"}`}>{g.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ROOM MATRIX ── */}
            {activeView === "Rooms" && (
              <motion.div key="rooms" variants={fadeUp} initial="hidden" animate="show" exit={{opacity:0,y:-20}} className="space-y-5">
                {["Sahyadri Boys","Krishna Girls"].map(hostelName=>(
                  <div key={hostelName} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                      <div><h3 className="font-extrabold text-slate-800 text-lg">{hostelName} Hostel</h3><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{rooms.filter(r=>r.hostel===hostelName&&r.status==="Available").length} available · {rooms.filter(r=>r.hostel===hostelName).length} total</p></div>
                      <div className="flex gap-2">
                        {[{label:"Available",color:"bg-emerald-50 border-emerald-200 text-emerald-600"},{label:"Full",color:"bg-slate-100 border-slate-200 text-slate-500"}].map(s=>(
                          <span key={s.label} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border uppercase ${s.color}`}>{s.label}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {rooms.filter(r=>r.hostel===hostelName).map((room,i)=>(
                        <div key={i} onClick={()=>toast(`Room ${room.number} — ${room.hostel} — ${room.type} — ${room.status}`)}
                          className={`cursor-pointer rounded-2xl p-5 border-2 transition-all hover:scale-[1.02] hover:shadow-md ${room.status==="Available"?"bg-emerald-50/50 border-emerald-100 hover:border-emerald-300":"bg-slate-50 border-slate-200"}`}>
                          <p className="text-lg font-extrabold text-slate-800 mb-0.5">Room {room.number}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{room.type}</p>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${room.status==="Available"?"bg-emerald-100 text-emerald-600":"bg-slate-200 text-slate-600"}`}>{room.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── LIVE TIMERS ── */}
            {activeView === "Timers" && (
              <motion.div key="timers" variants={fadeUp} initial="hidden" animate="show" exit={{opacity:0,y:-20}}>
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-800 text-xl">Live Check-in Timers</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time countdown for all checked-in guests</p>
                  </div>
                  <div className="p-5 space-y-4">
                    {approvedBookings.filter(b=>b.checkInStatus==="checked_in").length === 0 ? (
                      <div className="text-center py-14">
                        <Timer size={40} className="mx-auto mb-3 text-slate-200"/>
                        <p className="font-extrabold text-slate-400">No active check-ins</p>
                        <p className="text-sm text-slate-400 font-medium mt-1">Timers appear after QR scan at main gate.</p>
                      </div>
                    ) : approvedBookings.filter(b=>b.checkInStatus==="checked_in").map((booking,i)=>{
                      const remaining = Math.max(0, Math.floor((new Date(booking.actualCheckOutTime) - currentTime) / 1000));
                      const pct = Math.max(0, (remaining / (24*3600)) * 100);
                      return (
                        <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-sky-200 hover:bg-sky-50/30 transition-all">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="font-extrabold text-slate-800">{booking.user?.name || "—"}</p>
                              <p className="text-xs font-bold text-slate-500 mt-0.5">{booking.hostelName} · Room {booking.roomNumber}</p>
                              <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">{booking.duNumber}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-2xl font-extrabold text-slate-800 font-mono">{getRemainingTime(booking.actualCheckOutTime)}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5">remaining</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all ${pct > 25 ? "bg-emerald-400" : pct > 10 ? "bg-amber-400" : "bg-rose-400"}`} style={{width:`${pct}%`}}/>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                            <span>Checked in: {booking.actualCheckInTime ? new Date(booking.actualCheckInTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) : "—"}</span>
                            <span>Checkout: {booking.actualCheckOutTime ? new Date(booking.actualCheckOutTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) : "—"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <MobileNav/>
    </div>
  );
}

function StatCard({ label, value, icon, color, trend, urgent }) {
  return (
    <div className={`bg-white p-5 rounded-[2rem] border shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${urgent?"border-amber-200":"border-slate-100"}`}>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-inner flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none">{value}</h4>
        {trend&&<p className="text-[10px] font-bold text-slate-400 mt-1">{trend}</p>}
      </div>
    </div>
  );
}