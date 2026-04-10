import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, AlertTriangle, CheckCircle, Search, Filter, Map,
  ShieldCheck, Building2, Check, X, LogOut, Settings, Clock,
  DoorOpen, UserCheck, ShieldAlert, FileText, Download, Briefcase,
  Mail, QrCode, CalendarCheck, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function RectorDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // for detail modal
  const [requests, setRequests] = useState([]);

  // ─── Room pool for allocation ───
  const availableRooms = [
    { room: "S-101", hostel: "Sahyadri" },
    { room: "S-102", hostel: "Sahyadri" },
    { room: "N-201", hostel: "Nandgiri" },
    { room: "N-202", hostel: "Nandgiri" },
    { room: "V-01",  hostel: "VIP Wing"  },
    { room: "V-02",  hostel: "VIP Wing"  },
  ];

  // ─── Sync from localStorage every 2s ───
  useEffect(() => {
    const syncRequests = () => {
      const stored = JSON.parse(localStorage.getItem("pendingRequests")) || [
        {
          id: "DUJ192837", name: "Dr. Anjali Patil",
          designation: "HOD, Computer Science", date: "Today, 10:30 AM",
          receipt: "sbi_receipt_1.pdf", amount: "450",
          purpose: "Faculty Development Program", status: "pending"
        },
        {
          id: "DUJ998273", name: "Mr. Sharma",
          designation: "AICTE Inspector", date: "Today, 11:15 AM",
          receipt: "sbi_receipt_2.pdf", amount: "450",
          purpose: "Annual Inspection", status: "pending"
        }
      ];
      setRequests(stored);
    };
    syncRequests();
    const interval = setInterval(syncRequests, 2000);
    return () => clearInterval(interval);
  }, []);

  const [guests, setGuests] = useState([
    { id: "EMP-2041", name: "Prof. Arvind Kumar", designation: "Faculty", block: "Sahyadri", room: "S-102", status: "In Campus", checkin: "10 Apr 2026", checkout: "12 Apr 2026" },
    { id: "GST-9921", name: "Mr. Ramesh Desai", designation: "Official Guest", block: "VIP Wing", room: "V-01", status: "In Campus", checkin: "10 Apr 2026", checkout: "11 Apr 2026" },
    { id: "EMP-1102", name: "Dr. Sneha Rao", designation: "Principal Office", block: "Nandgiri", room: "N-204", status: "On Leave", checkin: "08 Apr 2026", checkout: "09 Apr 2026" },
  ]);

  const [rooms, setRooms] = useState([
    { number: "S-101", type: "Faculty Suite", occupied: 0, capacity: 1, status: "Available" },
    { number: "S-102", type: "Faculty Suite", occupied: 1, capacity: 1, status: "Full" },
    { number: "N-201", type: "Standard Room", occupied: 0, capacity: 2, status: "Available" },
    { number: "V-01",  type: "VIP Suite",     occupied: 1, capacity: 2, status: "Available" },
    { number: "V-02",  type: "VIP Suite",     occupied: 0, capacity: 2, status: "Maintenance" },
  ]);

  // ─── APPROVE ───
  const handleApprove = (reqId) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    // Auto-assign a room
    const freeRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
    const checkin = new Date();
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + 1);

    const checkinStr = checkin.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) + " — 2:00 PM";
    const checkoutStr = checkout.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) + " — 11:00 AM";

    // ✅ Simulate email notification toast
    toast.custom((t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex border border-emerald-100`}>
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800">Email Sent to {req.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                Room <strong>{freeRoom.room}</strong> in <strong>{freeRoom.hostel}</strong> Hostel<br />
                Check-in: {checkinStr}<br />
                Check-out: {checkoutStr}
              </p>
            </div>
          </div>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="p-4 text-slate-400 hover:text-slate-600">✕</button>
      </div>
    ), { duration: 6000 });

    // ✅ Update myBookings in localStorage with approved data
    const myBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
    const updatedBookings = myBookings.map(b => {
      if (b.id === reqId) {
        return {
          ...b,
          bookingStatus: "approved",
          roomNumber: freeRoom.room,
          hostelName: freeRoom.hostel,
          checkin: checkinStr,
          checkout: checkoutStr,
          approvedAt: new Date().toISOString(),
          qrEnabled: true,
        };
      }
      return b;
    });
    localStorage.setItem("myBookings", JSON.stringify(updatedBookings));

    // ✅ Add to Logbook
    const newGuest = {
      id: reqId,
      name: req.name,
      designation: req.designation,
      block: freeRoom.hostel,
      room: freeRoom.room,
      status: "In Campus",
      checkin: checkin.toLocaleDateString("en-IN"),
      checkout: checkout.toLocaleDateString("en-IN"),
    };
    setGuests(prev => [newGuest, ...prev]);

    // ✅ Update Room Matrix
    setRooms(prev => prev.map(r => r.number === freeRoom.room ? { ...r, occupied: r.occupied + 1, status: r.occupied + 1 >= r.capacity ? "Full" : r.status } : r));

    // ✅ Remove from pending queue
    const updatedReqs = requests.filter(r => r.id !== reqId);
    setRequests(updatedReqs);
    localStorage.setItem("pendingRequests", JSON.stringify(updatedReqs));

    toast.success(`✅ Approved! Room ${freeRoom.room} allocated to ${req.name}`, {
      style: { borderRadius: "12px", background: "#ecfdf5", color: "#059669", fontWeight: "bold" },
      duration: 4000
    });
  };

  // ─── REJECT ───
  const handleReject = (reqId) => {
    const req = requests.find(r => r.id === reqId);

    // Update myBookings
    const myBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
    const updatedBookings = myBookings.map(b =>
      b.id === reqId ? { ...b, bookingStatus: "rejected", rejectedAt: new Date().toISOString() } : b
    );
    localStorage.setItem("myBookings", JSON.stringify(updatedBookings));

    const updatedReqs = requests.filter(r => r.id !== reqId);
    setRequests(updatedReqs);
    localStorage.setItem("pendingRequests", JSON.stringify(updatedReqs));

    toast.error(`❌ Rejected — ${req?.name || "Request"} has been notified.`, {
      style: { borderRadius: "12px", background: "#fff1f2", color: "#e11d48", fontWeight: "bold" }
    });
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans flex text-slate-800">
      <Toaster position="top-right" />

      {/* ─── SIDEBAR ─── */}
      <aside className="hidden lg:flex w-[260px] bg-white flex-col justify-between p-6 border-r border-sky-100 fixed top-0 left-0 h-screen z-50">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-800 leading-none tracking-tight">StayPG Admin</p>
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Rector Console</p>
            </div>
          </div>
          <nav className="space-y-1.5">
            <NavItem icon={<Map size={18} />} label="Overview" active={activeView === "Overview"} onClick={() => setActiveView("Overview")} />
            <NavItem icon={<AlertTriangle size={18} />} label="Verifications" active={activeView === "Requests"} onClick={() => setActiveView("Requests")} badge={requests.length} />
            <NavItem icon={<Briefcase size={18} />} label="Staff/Guest Logbook" active={activeView === "Logbook"} onClick={() => setActiveView("Logbook")} />
            <NavItem icon={<DoorOpen size={18} />} label="Room Allocations" active={activeView === "Rooms"} onClick={() => setActiveView("Rooms")} />
          </nav>
        </div>
        <div className="space-y-1.5 border-t border-slate-100 pt-4 mt-2">
          <NavItem icon={<ShieldAlert size={18} className="text-rose-500" />} label="Campus Guards" onClick={() => toast("Guard interface locked.")} />
          <NavItem icon={<Settings size={18} />} label="Settings" onClick={() => toast("Settings opened.")} />
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 lg:ml-[260px] p-6 lg:p-10 max-w-7xl mx-auto w-full">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search DU Number or Name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-sky-100 rounded-2xl outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-bold text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-extrabold text-slate-800">Prof. S.R. Deshmukh</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1 mt-0.5">
                <ShieldCheck size={12} /> Chief Rector
              </p>
            </div>
            <div className="h-12 w-12 bg-sky-100 text-sky-600 rounded-2xl shadow-sm border border-sky-200 flex items-center justify-center font-black text-lg">SD</div>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ── */}
          {activeView === "Overview" && (
            <motion.div key="overview" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="In-House Guests" value={guests.filter(g => g.status === "In Campus").length.toString().padStart(2,"0")} icon={<UserCheck size={24} className="text-sky-500" />} color="bg-sky-50 border-sky-100" />
                <StatCard label="Pending Verify" value={requests.length.toString().padStart(2, "0")} icon={<Clock size={24} className="text-amber-500" />} color="bg-amber-50 border-amber-100" />
                <StatCard label="Rooms Available" value={rooms.filter(r => r.status === "Available").length.toString().padStart(2,"0")} icon={<DoorOpen size={24} className="text-emerald-500" />} color="bg-emerald-50 border-emerald-100" />
                <StatCard label="Overall Capacity" value="88%" icon={<CheckCircle size={24} className="text-teal-500" />} color="bg-teal-50 border-teal-100" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-xl">Action Required</h3>
                    <button onClick={() => setActiveView("Requests")} className="text-xs font-bold text-sky-600 hover:text-sky-800">View All →</button>
                  </div>
                  <div className="p-6 md:p-8 space-y-4 flex-1">
                    {requests.slice(0, 3).map((req, i) => (
                      <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-sky-200 hover:shadow-md transition-all group bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-base">{req.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{req.designation}</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveView("Requests")} className="bg-sky-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 hover:bg-sky-600 transition-all">
                          Review
                        </button>
                      </div>
                    ))}
                    {requests.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle size={40} className="mx-auto mb-3 text-emerald-300" />
                        <p className="font-bold text-slate-400">Inbox Zero. No pending requests!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/20 blur-[60px] rounded-full pointer-events-none" />
                  <ShieldCheck size={48} className="text-sky-400 mb-6" />
                  <h3 className="text-2xl font-extrabold mb-2">Campus Security</h3>
                  <p className="text-sm text-slate-300 mb-8 leading-relaxed">Guard scanner network is online. Access logs syncing in real-time.</p>
                  <button onClick={() => toast.success("Main Gate pinged! ✅")} className="bg-sky-500 hover:bg-sky-400 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-sky-500/30">
                    Ping Main Gate
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── VERIFICATION QUEUE ── */}
          {activeView === "Requests" && (
            <motion.div key="requests" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-[2rem] border border-sky-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight">Verification Queue</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {requests.length} pending approval
                    </p>
                  </div>
                  <button className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                    <Filter size={14} /> Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-5">DU Reference</th>
                        <th className="px-6 py-5">Identity</th>
                        <th className="px-6 py-5">Purpose</th>
                        <th className="px-6 py-5">Submitted</th>
                        <th className="px-6 py-5">Receipt</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-700">
                      {requests.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-20">
                            <CheckCircle size={48} className="mx-auto mb-4 text-emerald-200" />
                            <p className="text-emerald-500 font-extrabold text-lg">Queue Empty ✅</p>
                            <p className="text-slate-400 text-sm mt-1">All requests have been processed.</p>
                          </td>
                        </tr>
                      ) : (
                        requests
                          .filter(r =>
                            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.id.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((req) => (
                            <tr key={req.id} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                              <td className="px-6 py-5 font-mono text-xs text-sky-600 font-black">{req.id}</td>
                              <td className="px-6 py-5">
                                <p className="font-extrabold text-slate-800">{req.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{req.designation}</p>
                              </td>
                              <td className="px-6 py-5 text-xs text-slate-500">{req.purpose || "—"}</td>
                              <td className="px-6 py-5 text-xs text-slate-500 font-medium">{req.date}</td>
                              <td className="px-6 py-5">
                                <button
                                  onClick={() => toast(`Viewing: ${req.receipt}`)}
                                  className="flex items-center gap-1.5 text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 font-bold text-xs hover:bg-sky-100"
                                >
                                  <Eye size={12} /> View
                                </button>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleApprove(req.id)}
                                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1"
                                  >
                                    <Check size={14} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(req.id)}
                                    className="px-4 py-2.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── LOGBOOK ── */}
          {activeView === "Logbook" && (
            <motion.div key="logbook" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-[2rem] border border-sky-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight">Staff & Guest Logbook</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Official Registry — {guests.length} Records</p>
                  </div>
                  <button onClick={() => toast.success("Exporting CSV...")} className="bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-900 shadow-md">
                    <Download size={16} /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">ID / DU Ref</th>
                        <th className="px-8 py-5">Name & Designation</th>
                        <th className="px-8 py-5">Room Allocated</th>
                        <th className="px-8 py-5">Check-in</th>
                        <th className="px-8 py-5">Check-out</th>
                        <th className="px-8 py-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-700">
                      {guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).map((guest, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-sky-50/50 transition-colors">
                          <td className="px-8 py-5 font-mono text-xs text-slate-500">{guest.id}</td>
                          <td className="px-8 py-5">
                            <p className="font-extrabold text-slate-800">{guest.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{guest.designation}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className="font-extrabold text-slate-700">{guest.room}</span>
                            <span className="text-[10px] text-slate-400 ml-2">({guest.block})</span>
                          </td>
                          <td className="px-8 py-5 text-xs text-slate-600">{guest.checkin || "—"}</td>
                          <td className="px-8 py-5 text-xs text-slate-600">{guest.checkout || "—"}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${guest.status === "In Campus" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                              {guest.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ROOMS ── */}
          {activeView === "Rooms" && (
            <motion.div key="rooms" variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-[2rem] border border-sky-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight">Room Matrix</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Faculty & VIP Suite Status</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-emerald-50 border border-emerald-200"></span> Available</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></span> Full</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-rose-50 border border-rose-200"></span> Maintenance</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {rooms.map((room, i) => (
                    <div key={i} onClick={() => toast(`Room ${room.number} — ${room.status}`)} className={`cursor-pointer rounded-2xl p-6 border-2 transition-all hover:scale-[1.02] ${room.status === "Available" ? "bg-emerald-50/50 border-emerald-100" : room.status === "Full" ? "bg-slate-50 border-slate-200" : "bg-rose-50/50 border-rose-100"}`}>
                      <h4 className="text-xl font-black text-slate-800 mb-1">{room.number}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{room.type}</p>
                      <p className="text-lg font-extrabold text-slate-700">{room.occupied} <span className="text-sm text-slate-400">/ {room.capacity}</span></p>
                      <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${room.status === "Available" ? "bg-emerald-100 text-emerald-600" : room.status === "Full" ? "bg-slate-200 text-slate-600" : "bg-rose-100 text-rose-600"}`}>
                        {room.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"}`}>
      <div className="flex items-center gap-3">{icon} <span className="tracking-wide">{label}</span></div>
      {badge > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? "bg-white text-sky-600" : "bg-rose-500 text-white"}`}>{badge}</span>}
    </button>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-inner ${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
      </div>
    </div>
  );
}