import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Eye, MapPin, CheckCircle, Star, Wifi, Wind, Coffee,
  Users, ChevronRight, Search, Bell, LogOut, Sparkles,
  Calendar, Shield, Zap, TrendingUp, Home as HomeIcon, Building2
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── IMPORT LOCAL IMAGES ──────────────────────────────────────── */
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

/* ─── HOSTEL DATA ──────────────────────────────────────────────── */
const hostels = [
  { id: "s1", name: "Sahyadri Block A", gender: "male",  rooms: 8,  rating: 4.8, amenities: ["wifi","ac","cafe"], img: boys_hostel1, tag: "Most Popular" },
  { id: "s2", name: "Sahyadri Block B", gender: "male",  rooms: 8,  rating: 4.6, amenities: ["wifi","ac"],        img: boys_hostel2 },
  { id: "s3", name: "Sahyadri Block C", gender: "male",  rooms: 8,  rating: 4.5, amenities: ["wifi","cafe"],      img: boys_hostel3 },
  { id: "s4", name: "Sahyadri Block D", gender: "male",  rooms: 8,  rating: 4.7, amenities: ["wifi","ac","cafe"], img: boys_hostel4, tag: "Premium" },
  { id: "s5", name: "Sahyadri Block E", gender: "male",  rooms: 8,  rating: 4.4, amenities: ["wifi"],             img: boys_hostel5 },
  { id: "s6", name: "Sahyadri Block F", gender: "male",  rooms: 8,  rating: 4.3, amenities: ["wifi","cafe"],      img: boys_hostel6 },
  { id: "n1", name: "Nandgiri Unit 1",  gender: "female",rooms: 2,  rating: 4.9, amenities: ["wifi","ac","cafe"], img: girls_hostel1, tag: "Top Rated" },
  { id: "n2", name: "Nandgiri Unit 2",  gender: "female",rooms: 2,  rating: 4.7, amenities: ["wifi","ac"],        img: girls_hostel2 },
  { id: "g1", name: "Sahyadri Guest Wing", gender: "male", rooms: 4, rating: 4.8, amenities: ["wifi","ac","cafe"], img: boys_hostel7, tag: "Guest" },
  { id: "v1", name: "Sahyadri VIP Wing",   gender: "male", rooms: 2, rating: 5.0, amenities: ["wifi","ac","cafe"], img: boys_hostel8, tag: "VIP ✦" },
];

const amenityIcon = { wifi: <Wifi size={14}/>, ac: <Wind size={14}/>, cafe: <Coffee size={14}/> };
const amenityLabel = { wifi: "Wi-Fi", ac: "AC", cafe: "Café" };

/* ─── STAT PILL ───────────────────────────────────────────────── */
function StatPill({ icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 shadow-sm border border-slate-100"
    >
      <span className={`p-3 rounded-xl ${color}`}>{icon}</span>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
      </div>
    </motion.div>
  );
}

/* ─── HOSTEL CARD ─────────────────────────────────────────────── */
function HostelCard({ h, isLocked, onExplore, onBook, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative bg-white rounded-[2rem] overflow-hidden flex flex-col border border-sky-100 transition-all duration-500
        ${isLocked ? "opacity-60 grayscale" : "shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-200"}`}
      style={{ transform: hovered && !isLocked ? "translateY(-8px)" : "translateY(0)" }}
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={h.img}
          alt={h.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* TAG BADGE */}
        {h.tag && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            {h.tag}
          </div>
        )}

        {/* GENDER PILL */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border
          ${h.gender === "male" ? "bg-sky-100/90 text-sky-700 border-sky-200/50" : "bg-rose-100/90 text-rose-600 border-rose-200/50"}`}>
          {h.gender === "male" ? "♂ Male" : "♀ Female"}
        </div>

        {/* ROOMS BOTTOM */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-emerald-600 text-xs font-bold rounded-full px-3 py-1.5 shadow-sm">
          <CheckCircle size={14} /> {h.rooms} rooms
        </div>

        {/* RATING */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-amber-500 text-xs font-bold rounded-full px-3 py-1.5 shadow-sm">
          <Star size={14} fill="currentColor" /> {h.rating}
        </div>
      </div>

      {/* BODY */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl font-extrabold text-slate-800 leading-tight mb-4 tracking-tight">{h.name}</h2>

        {/* AMENITIES */}
        <div className="flex flex-wrap gap-2 mb-6">
          {h.amenities.map(a => (
            <span key={a} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-widest">
              {amenityIcon[a]} {amenityLabel[a]}
            </span>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-3">
          <button
            onClick={() => onExplore(h)}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-100 text-slate-600 hover:text-sky-600 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Eye size={16} /> View
          </button>
          {!isLocked ? (
            <button
              onClick={() => onBook(h)}
              className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              <Zap size={16} /> Book
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-100 text-slate-400 py-3.5 rounded-xl border border-slate-200">
              <Lock size={16} /> Locked
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN HOME ───────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest","gender":"male"}');

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | male | female
  const [sortBy, setSortBy] = useState("default"); // default | rating | rooms
  const [notifOpen, setNotifOpen] = useState(false);

  /* live clock */
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const handleExplore = (h) => {
    if (user.gender !== h.gender) {
      toast.error(`${h.name} is reserved for ${h.gender}s only.`, {
        icon: "🚫",
        style: { borderRadius: "14px", background: "#fff", color: "#e11d48", fontWeight: "700", fontSize: "14px", border: "1px solid #ffe4e6" }
      });
      return;
    }
    navigate(`/explorer/${h.id}`);
  };

  const handleBook = (h) => navigate(`/explorer/${h.id}`);

  /* filter + search + sort */
  const visible = hostels
    .filter(h => filter === "all" || h.gender === filter)
    .filter(h => h.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "rooms") return b.rooms - a.rooms;
      return 0;
    });

  const maleCount = hostels.filter(h => h.gender === "male").reduce((s, h) => s + h.rooms, 0);
  const femaleCount = hostels.filter(h => h.gender === "female").reduce((s, h) => s + h.rooms, 0);
  const avgRating = (hostels.reduce((s, h) => s + h.rating, 0) / hostels.length).toFixed(1);

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans text-slate-800 selection:bg-sky-500 selection:text-white">

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-sky-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-800 leading-none tracking-tight">StayPG</p>
              <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest leading-none mt-1.5">Campus Explorer</p>
            </div>
          </div>

          {/* CENTER LIVE CLOCK */}
          <div className="hidden md:flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-sky-100 shadow-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-600 tracking-wider">{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-sm text-slate-300">|</span>
            <MapPin size={14} className="text-sky-500" />
            <span className="text-sm font-bold text-slate-600">Nanded Campus</span>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-11 h-11 bg-white border border-sky-100 rounded-xl flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-colors shadow-sm text-slate-500 hover:text-sky-600"
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-sky-100 p-5 z-50"
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Alerts</p>
                    {[
                      { icon: "🏠", msg: "Sahyadri Block D — 2 rooms freed up", time: "5m ago" },
                      { icon: "💳", msg: "Your last booking receipt is ready", time: "1h ago" },
                      { icon: "📢", msg: "Hostel maintenance: Block A, Sun 6–8am", time: "Yesterday" },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-4 py-3 border-b border-slate-50 last:border-none">
                        <span className="text-xl bg-slate-50 w-10 h-10 flex items-center justify-center rounded-lg">{n.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-700 leading-snug">{n.msg}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar matching Dashboard */}
            <div 
              onClick={() => navigate("/dashboard")} 
              className="hidden md:flex items-center gap-3 bg-white border border-sky-100 rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:shadow-md hover:border-sky-200 transition-all"
            >
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 text-sm font-black">
                {user.name[0]}
              </div>
              <span className="text-sm font-bold text-slate-800">{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── HERO SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-white border border-sky-100 shadow-sm"
        >
          {/* decorative backgrounds */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-50 to-transparent pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4 bg-sky-50 w-fit px-3 py-1.5 rounded-full border border-sky-100">
                <Sparkles size={14} className="text-sky-500" />
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">SGGS Institute of Engineering</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-4 tracking-tight">
                Find your perfect <span className="text-sky-500">campus stay.</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                Browse, explore and book hostel rooms across all SGGS campus blocks — directly from your dashboard.
              </p>

              {/* SEARCH BAR */}
              <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-sky-100 w-full focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
                <Search size={20} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search blocks, wings, or room types..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 outline-none text-sm font-bold text-slate-700 bg-transparent placeholder-slate-400"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* STAT PILLS */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0 w-full lg:w-auto">
              <StatPill icon={<Building2 size={24} className="text-sky-500" />}  label="Male Rooms"   value={`${maleCount}`}   color="bg-sky-50" />
              <StatPill icon={<Users size={24} className="text-rose-500" />}     label="Female Rooms" value={`${femaleCount}`} color="bg-rose-50" />
              <StatPill icon={<Star size={24} className="text-amber-500" />}     label="Avg Rating"   value={`${avgRating}`}   color="bg-amber-50" />
              <StatPill icon={<Shield size={24} className="text-emerald-500" />} label="Security"     value="24/7"            color="bg-emerald-50" />
            </div>
          </div>
        </motion.div>

        {/* ── FILTER BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center justify-between mb-10"
        >
          <div className="flex flex-wrap gap-4">
            {/* Gender Filter */}
            <div className="flex bg-white rounded-2xl p-1.5 border border-sky-100 shadow-sm gap-1">
              {[
                { val: "all",    label: "All Blocks" },
                { val: "male",   label: "♂ Boys" },
                { val: "female", label: "♀ Girls" },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setFilter(opt.val)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    filter === opt.val
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex bg-white rounded-2xl p-1.5 border border-sky-100 shadow-sm gap-1">
              {[
                { val: "default", label: "Default" },
                { val: "rating",  label: "★ Rating" },
                { val: "rooms",   label: "Capacity" },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setSortBy(opt.val)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    sortBy === opt.val
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-sky-100">
            {visible.length} Properties
          </span>
        </motion.div>

        {/* ── GRID ── */}
        <AnimatePresence mode="wait">
          {visible.length > 0 ? (
            <motion.div
              key={filter + sortBy + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {visible.map((h, i) => (
                <HostelCard
                  key={h.id}
                  h={h}
                  index={i}
                  isLocked={user.gender !== h.gender}
                  onExplore={handleExplore}
                  onBook={handleBook}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-sky-200"
            >
              <Search size={48} className="mx-auto text-sky-200 mb-6" />
              <p className="text-lg font-extrabold text-slate-700">No properties found</p>
              <p className="text-sm font-medium text-slate-400 mt-2">Try adjusting your filters or search term.</p>
              <button onClick={() => {setSearch(""); setFilter("all");}} className="mt-6 text-sky-500 text-sm font-bold hover:text-sky-600 transition-colors bg-sky-50 px-6 py-3 rounded-xl">
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INFO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm bg-white border border-sky-100"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-sky-100">
              <Calendar size={28} className="text-sky-500" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-800 mb-1">Academic Year 2024–25 Open</p>
              <p className="text-sm text-slate-500 font-medium">New allotments are currently being processed by the Rector's office.</p>
            </div>
          </div>
          <button className="flex-shrink-0 flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95">
            View Schedule <ChevronRight size={16} />
          </button>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-16 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase pb-10">
          SGGS StayPG · Vishnupuri, Nanded · Campus Hostel Management System
        </div>
      </div>
    </div>
  );
}

// Ensure X is available for the search clear button
const X = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);