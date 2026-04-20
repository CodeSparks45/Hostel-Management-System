import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Eye, CheckCircle, Star, Wifi, Wind, Coffee,
   Search, Bell, Sparkles, Calendar, Shield,
  Zap, Building2,  MapPin, X,  
   ArrowRight, Users // ✅ ADDED Users ICON FOR GROUP BOOKING BANNER
} from "lucide-react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import API from "../services/api"; // ✅ ADDED API IMPORT AT THE TOP

import boys_hostel1 from "./boys_hostel1.jpeg";
import boys_hostel2 from "./boys_hostel2.jpeg";
import boys_hostel3 from "./boys_hostel3.jpeg";
import boys_hostel4 from "./boys_hostel4.jpeg";
import boys_hostel5 from "./boys_hostel5.jpeg";
import boys_hostel6 from "./boys_hostel6.jpeg";
import boys_hostel7 from "./boys_hostel7.jpeg";
import boys_hostel8 from "./boys_hostel8.png";
import girls_hostel1 from "./girls_hostel1.png";
import girls_hostel2 from "./girls_hostel2.png";

// ── REAL ROOM DATA ──────────────────────────────────────────────
// Sahyadri Boys Hostel: 8 rooms total (4 AC + 4 Non-AC)
// Krishna Girls Hostel: 2 rooms total (2 Non-AC)
const ROOMS = [
  // ── SAHYADRI BOYS HOSTEL — AC ROOMS ──
  {
    id: "sahyadri-A4",
    roomNumber: "A4",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    price: 550,
    rating: 4.8,
    amenities: ["wifi", "ac", "mess"],
    img: boys_hostel1,
    tag: "Premium",
    floor: "Ground Floor",
    desc: "Spacious AC room with attached study desk, wardrobe, and 24/7 cooling. Perfect for focused work.",
    capacity: 1,
    available: true,
  },
  {
    id: "sahyadri-A10",
    roomNumber: "A10",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    price: 550,
    rating: 4.7,
    amenities: ["wifi", "ac", "mess"],
    img: boys_hostel2,
    tag: "Popular",
    floor: "First Floor",
    desc: "Corner AC room with garden view. Quiet environment ideal for researchers and visiting faculty.",
    capacity: 1,
    available: true,
  },
  {
    id: "sahyadri-B4",
    roomNumber: "B4",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    price: 550,
    rating: 4.6,
    amenities: ["wifi", "ac", "mess"],
    img: boys_hostel3,
    tag: null,
    floor: "Ground Floor",
    desc: "Well-maintained AC room in Block B. Close to administrative wing and parking.",
    capacity: 1,
    available: true,
  },
  {
    id: "sahyadri-B10",
    roomNumber: "B10",
    hostel: "Sahyadri Boys Hostel",
    type: "AC",
    gender: "male",
    price: 550,
    rating: 4.9,
    amenities: ["wifi", "ac", "mess", "cafe"],
    img: boys_hostel4,
    tag: "Top Rated",
    floor: "First Floor",
    desc: "Premium Block B top-floor AC room with campus panoramic view. Most requested room.",
    capacity: 1,
    available: true,
  },
  // ── SAHYADRI BOYS HOSTEL — NON-AC ROOMS ──
  {
    id: "sahyadri-A8",
    roomNumber: "A8",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    price: 450,
    rating: 4.4,
    amenities: ["wifi", "mess"],
    img: boys_hostel5,
    tag: null,
    floor: "Ground Floor",
    desc: "Standard Non-AC room with ceiling fan and natural ventilation. Budget-friendly option.",
    capacity: 1,
    available: true,
  },
  {
    id: "sahyadri-A9",
    roomNumber: "A9",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    price: 450,
    rating: 4.3,
    amenities: ["wifi", "mess"],
    img: boys_hostel6,
    tag: null,
    floor: "Ground Floor",
    desc: "Comfortable Non-AC room adjacent to reading hall. Great for early risers.",
    capacity: 1,
    available: true,
  },
  {
    id: "sahyadri-B8",
    roomNumber: "B8",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    price: 450,
    rating: 4.5,
    amenities: ["wifi", "mess", "cafe"],
    img: boys_hostel7,
    tag: null,
    floor: "Ground Floor",
    desc: "Block B Non-AC room near the common lounge. Social and vibrant atmosphere.",
    capacity: 1,
    available: true,
  },
  {
    id: "sahyadri-B9",
    roomNumber: "B9",
    hostel: "Sahyadri Boys Hostel",
    type: "Non-AC",
    gender: "male",
    price: 450,
    rating: 4.4,
    amenities: ["wifi", "mess"],
    img: boys_hostel8,
    tag: null,
    floor: "First Floor",
    desc: "First floor Non-AC room with excellent breeze. Highly preferred during winters.",
    capacity: 1,
    available: true,
  },
  // ── KRISHNA GIRLS HOSTEL — NON-AC ROOMS ──
  {
    id: "krishna-A9",
    roomNumber: "A9",
    hostel: "Krishna Girls Hostel",
    type: "Non-AC",
    gender: "female",
    price: 450,
    rating: 4.8,
    amenities: ["wifi", "mess"],
    img: girls_hostel1,
    tag: "Top Rated",
    floor: "Ground Floor",
    desc: "Secure and well-lit Non-AC room in Krishna Girls Hostel with 24/7 security.",
    capacity: 1,
    available: true,
  },
  {
    id: "krishna-A10",
    roomNumber: "A10",
    hostel: "Krishna Girls Hostel",
    type: "Non-AC",
    gender: "female",
    price: 450,
    rating: 4.7,
    amenities: ["wifi", "mess"],
    img: girls_hostel2,
    tag: null,
    floor: "Ground Floor",
    desc: "Spacious Non-AC room with extra storage. Peaceful environment for extended stays.",
    capacity: 1,
    available: true,
  },
];

const amenityIcon  = { wifi: <Wifi size={12}/>,  ac: <Wind size={12}/>, mess: "🍽️", cafe: <Coffee size={12}/> };
const amenityLabel = { wifi: "Wi-Fi", ac: "AC", mess: "Mess", cafe: "Café" };

// ── STAT PILL ──────────────────────────────────────────────────
function StatPill({ icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-sm border border-slate-100"
    >
      <span className={`p-2.5 rounded-xl ${color}`}>{icon}</span>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
      </div>
    </motion.div>
  );
}

// ── ROOM CARD ─────────────────────────────────────────────────
function RoomCard({ room, isLocked, isRoomBooked, onExplore, onBook, index }) {
  const [hovered, setHovered] = useState(false);

  const isFull = isRoomBooked || (room.availableRooms !== undefined && room.availableRooms <= 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative bg-white rounded-[2rem] overflow-hidden flex flex-col border transition-all duration-500
        ${isLocked
          ? "border-slate-100 opacity-55 grayscale"
          : "border-sky-100 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-200"
        }`}
      style={{ transform: hovered && !isLocked ? "translateY(-6px)" : "translateY(0)" }}
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={room.img} alt={`${room.hostel} Room ${room.roomNumber}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

        {/* TAG */}
        {room.tag && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
            {room.tag}
          </div>
        )}

        {/* TYPE BADGE */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border
          ${room.type === "AC"
            ? "bg-sky-100/90 text-sky-700 border-sky-200/50"
            : "bg-slate-100/90 text-slate-600 border-slate-200/50"
          }`}>
          {room.type === "AC" ? "❄️ AC" : "🌀 Non-AC"}
        </div>

        {/* BOTTOM INFO */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <div className="bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold rounded-full px-3 py-1 shadow-sm">
            {room.floor}
          </div>
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md text-amber-500 text-[10px] font-bold rounded-full px-2.5 py-1 shadow-sm">
            <Star size={11} fill="currentColor" /> {room.rating}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex flex-col flex-1">
        {/* Hostel Name + Room Number */}
        <div className="mb-1">
          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">{room.hostel}</p>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Room No. {room.roomNumber}</h2>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">{room.desc}</p>

        {/* AMENITIES */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.map(a => (
            <span key={a} className="flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-500 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
              {amenityIcon[a]} {amenityLabel[a]}
            </span>
          ))}
        </div>

        {/* PRICE */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-slate-800">₹{room.price}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ day</span>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onExplore(room)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-100 text-slate-600 hover:text-sky-600 py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Eye size={14} /> Details
          </button>
          
          {isFull ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-1 bg-rose-50 text-rose-500 py-3 rounded-xl border border-rose-100 text-xs font-bold">
              <span>🔴 BOOKED</span>
              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Not Available</span>
            </div>
          ) : !isLocked ? (
            <button
              onClick={() => onBook(room)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              <Zap size={14} /> Book Now
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 text-slate-400 py-3 rounded-xl border border-slate-200 text-xs font-bold">
              <Lock size={13} /> Locked
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN HOME ─────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest","gender":"male"}');

  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");   // all | male | female
  const [typeFilter, setTypeFilter] = useState("all"); // all | AC | Non-AC
  const [sortBy,    setSortBy]    = useState("default");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { icon: "🏨", msg: "Sahyadri B10 — 1 seat available", time: "Just now", unread: true },
    { icon: "💳", msg: "Your booking receipt is ready to download", time: "1h ago", unread: true },
    { icon: "📢", msg: "Hostel inspection: Block A, Sunday 7–9am", time: "Yesterday", unread: false },
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  const [time, setTime] = useState(new Date());

  // ✅ 1. NEW FETCH AVAILABILITY LOGIC
  const [roomAvailability, setRoomAvailability] = useState({});
  const [availSummary, setAvailSummary]         = useState(null);

  useEffect(() => {
    fetchAvailability();
    const iv = setInterval(fetchAvailability, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res  = await API.get("/api/book/room-status");
      const data = res.data;

      setAvailSummary(data.summary);

      const map = {};
      data.rooms?.forEach(r => {
        // "sahyadri-A4" format mein map banao
        const hostelPrefix = r.hostel.toLowerCase().includes("krishna") ? "krishna" : "sahyadri";
        const key = `${hostelPrefix}-${r.number}`;
        map[key] = r.isBooked;
      });
      setRoomAvailability(map);
    } catch (e) {
      console.log("Avail fetch:", e.message);
    }
  };

  const handleExplore = (room) => {
    if (user.gender !== room.gender) {
      toast.error(`${room.hostel} is reserved for ${room.gender === "male" ? "male" : "female"} guests only.`, {
        icon: "🚫",
        style: { borderRadius: "14px", background: "#fff", color: "#e11d48", fontWeight: "700", border: "1px solid #ffe4e6" }
      });
      return;
    }
    // Navigate to Explorer with room id
    navigate(`/explorer/${room.id}`);
  };

  const handleBook = (room) => {
    if (user.gender !== room.gender) {
      toast.error(`This room is for ${room.gender === "male" ? "male" : "female"} guests only.`);
      return;
    }
    navigate(`/explorer/${room.id}`);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setNotifOpen(false);
  };

  // Filter + search + sort
  const visible = ROOMS
    .filter(r => filter === "all"    || r.gender === filter)
    .filter(r => typeFilter === "all" || r.type === typeFilter)
    .filter(r => 
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.hostel.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low")  return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const totalRooms     = ROOMS.length;
  
  const avgRating      = (ROOMS.reduce((s, r) => s + r.rating, 0) / ROOMS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans text-slate-800 selection:bg-sky-500 selection:text-white">
      <Toaster position="top-right" />

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-sky-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* LOGO */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/25">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-800 leading-none">StayPG</p>
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-0.5">SGGSIE&T Campus</p>
            </div>
          </div>

          {/* SEARCH BAR — CENTER */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text" placeholder="Search rooms, hostels..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm font-bold text-slate-700 bg-transparent placeholder-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Live clock */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-600 tabular-nums">
                {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-colors shadow-sm text-slate-500 hover:text-sky-600"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden z-50"
                  >
                    <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
                      <p className="text-sm font-extrabold text-slate-800">Notifications</p>
                      <button onClick={markAllRead} className="text-[10px] font-bold text-sky-500 hover:text-sky-700 uppercase tracking-widest">
                        Mark all read
                      </button>
                    </div>
                    {notifications.map((n, i) => (
                      <div key={i} className={`flex gap-4 px-5 py-3.5 border-b border-slate-50 last:border-none transition-colors ${n.unread ? "bg-sky-50/50" : ""}`}>
                        <span className="text-lg bg-white w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 flex-shrink-0">
                          {n.icon}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-700 leading-snug">{n.msg}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{n.time}</p>
                        </div>
                        {n.unread && <div className="w-2 h-2 bg-sky-500 rounded-full mt-1 flex-shrink-0" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:shadow-md hover:border-sky-200 transition-all"
            >
              <div className="w-7 h-7 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 text-sm font-black">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-slate-800 hidden sm:block">{user.name?.split(" ")[0]}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── HERO SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative mb-10 rounded-[2.5rem] overflow-hidden bg-white border border-sky-100 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-50 to-transparent pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 p-10 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 mb-4 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                <Sparkles size={13} className="text-sky-500" />
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">SGGS Institute of Engineering & Technology</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-3 tracking-tight">
                Official Campus <br /><span className="text-sky-500">Accommodation.</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-2">
                <strong className="text-slate-700">10 rooms</strong> across <strong className="text-slate-700">2 hostels</strong> — exclusively for SGGSIE&T staff, faculty, HODs, and institutional guests visiting the campus.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <CheckCircle size={13} /> Sahyadri Boys Hostel — 8 Rooms
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                  <CheckCircle size={13} /> Krishna Girls Hostel — 2 Rooms
                </span>
              </div>
            </div>

            {/* STAT PILLS */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0 w-full lg:w-auto">
              <StatPill icon={<Building2 size={22} className="text-sky-500" />} label="Total Rooms" value={`${totalRooms}`} color="bg-sky-50" />
              <StatPill icon={<Shield size={22} className="text-emerald-500" />} label="Security" value="24/7" color="bg-emerald-50" />
              <StatPill icon={<Star size={22} className="text-amber-500" />} label="Avg Rating" value={avgRating} color="bg-amber-50" />
              <StatPill icon={<MapPin size={22} className="text-rose-500" />} label="Location" value="Nanded" color="bg-rose-50" />
            </div>
          </div>
        </motion.div>

        {/* ── MOBILE SEARCH ── */}
        <div className="flex md:hidden items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 focus-within:border-sky-300 transition-all shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            type="text" placeholder="Search rooms..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm font-bold text-slate-700 bg-transparent placeholder-slate-400"
          />
        </div>

        {/* ✅ 3. GROUP BOOKING BANNER ADDED HERE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-[2rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-sky-500/30">
              <Users size={22} className="text-sky-400" />
            </div>
            <div>
              <p className="text-base font-extrabold text-white">Coming with a group?</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Recruiters, inspectors, or delegations — book all rooms in one go. Mixed gender OK.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/group-booking")}
            className="flex-shrink-0 flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Users size={15} /> Book for Group →
          </button>
        </motion.div>

        {/* ── FILTER BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 items-center justify-between mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {/* Gender Filter */}
            <div className="flex bg-white rounded-2xl p-1.5 border border-sky-100 shadow-sm gap-1">
              {[
                { val: "all",    label: "All" },
                { val: "male",   label: "♂ Boys" },
                { val: "female", label: "♀ Girls" },
              ].map(opt => (
                <button key={opt.val} onClick={() => setFilter(opt.val)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    filter === opt.val ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex bg-white rounded-2xl p-1.5 border border-sky-100 shadow-sm gap-1">
              {[
                { val: "all",    label: "All Types" },
                { val: "AC",     label: "❄️ AC" },
                { val: "Non-AC", label: "🌀 Non-AC" },
              ].map(opt => (
                <button key={opt.val} onClick={() => setTypeFilter(opt.val)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    typeFilter === opt.val ? "bg-teal-500 text-white shadow-md" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex bg-white rounded-2xl p-1.5 border border-sky-100 shadow-sm gap-1">
              {[
                { val: "default",    label: "Default" },
                { val: "rating",     label: "★ Rating" },
                { val: "price-low",  label: "↑ Price" },
                { val: "price-high", label: "↓ Price" },
              ].map(opt => (
                <button key={opt.val} onClick={() => setSortBy(opt.val)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    sortBy === opt.val ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-sky-100">
              {visible.length} / {totalRooms} Rooms
            </span>
          </div>
        </motion.div>

        {/* ── HOSTEL SECTION HEADERS + GRID ── */}
        {["male", "female"].map(gender => {
          const genderRooms = visible.filter(r => r.gender === gender);
          if (genderRooms.length === 0) return null;
          const hostelName = gender === "male" ? "Sahyadri Boys Hostel" : "Krishna Girls Hostel";
          const hostelColor = gender === "male" ? "text-sky-600 bg-sky-50 border-sky-100" : "text-rose-500 bg-rose-50 border-rose-100";

          return (
            <div key={gender} className="mb-12">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${hostelColor}`}>
                  <Building2 size={16} />
                  {hostelName}
                </div>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {genderRooms.length} rooms
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={filter + typeFilter + sortBy + search}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {genderRooms.map((room, i) => {
                    // ✅ 4. FETCHING isRoomCurrentlyBooked AND PASSING TO RoomCard
                    const isRoomCurrentlyBooked = roomAvailability[room.id] || false;

                    return (
                      <RoomCard
                        key={room.id}
                        room={room}
                        index={i}
                        isLocked={user.gender !== room.gender}
                        isRoomBooked={isRoomCurrentlyBooked} // ← ADDED THIS
                        onExplore={handleExplore}
                        onBook={handleBook}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}

        {/* Empty State */}
        {visible.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-sky-200"
          >
            <Search size={48} className="mx-auto text-sky-200 mb-6" />
            <p className="text-lg font-extrabold text-slate-700">No rooms found</p>
            <p className="text-sm font-medium text-slate-400 mt-2">Try adjusting your filters or search term.</p>
            <button
              onClick={() => { setSearch(""); setFilter("all"); setTypeFilter("all"); }}
              className="mt-6 text-sky-500 text-sm font-bold hover:text-sky-600 transition-colors bg-sky-50 px-6 py-3 rounded-xl"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* ── INFO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-12 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-sky-500/30">
              <Calendar size={26} className="text-sky-400" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white mb-1">Academic Year 2025–26 Open</p>
              <p className="text-sm text-slate-400 font-medium">Allotments processed by the Rector's office within 24–48 hours.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-shrink-0 flex items-center gap-3 bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
          >
            Go to Dashboard <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase pb-8">
          SGGS StayPG · Vishnupuri, Nanded · Campus Hostel Management System · 2025–26
        </div>
      </div>
    </div>
  );
}