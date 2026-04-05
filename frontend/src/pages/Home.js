import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
      className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-sm border border-white"
    >
      <span className={`p-3 rounded-xl ${color}`}>{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider leading-none">{label}</p>
        <p className="text-lg font-black text-gray-800 leading-tight mt-1">{value}</p>
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
      className={`group relative bg-white rounded-[28px] overflow-hidden flex flex-col
        ${isLocked ? "opacity-60 grayscale" : "shadow-[0_8px_40px_rgba(234,88,12,0.10)] hover:shadow-[0_20px_60px_rgba(234,88,12,0.18)]"}
        border border-orange-50 transition-all duration-500`}
      style={{ transform: hovered && !isLocked ? "translateY(-8px)" : "translateY(0)" }}
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={h.img}
          alt={h.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* TAG BADGE */}
        {h.tag && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
            {h.tag}
          </div>
        )}

        {/* GENDER PILL */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm
          ${h.gender === "male" ? "bg-sky-100/90 text-sky-700" : "bg-rose-100/90 text-rose-600"}`}>
          {h.gender === "male" ? "♂ Male" : "♀ Female"}
        </div>

        {/* ROOMS BOTTOM */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-sm font-bold rounded-full px-3 py-1.5">
          <CheckCircle size={14} /> {h.rooms} rooms
        </div>

        {/* RATING */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-600 text-sm font-bold rounded-full px-3 py-1.5">
          <Star size={14} fill="currentColor" /> {h.rating}
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-black text-gray-800 leading-tight mb-3">{h.name}</h2>

        {/* AMENITIES */}
        <div className="flex flex-wrap gap-2 mb-5">
          {h.amenities.map(a => (
            <span key={a} className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase">
              {amenityIcon[a]} {amenityLabel[a]}
            </span>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex gap-3">
          <button
            onClick={() => onExplore(h)}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-600 py-3 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors"
          >
            <Eye size={16} /> View
          </button>
          {!isLocked ? (
            <button
              onClick={() => onBook(h)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-orange-200 hover:from-orange-500 hover:to-amber-500 transition-all"
            >
              <Zap size={16} /> Book
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-400 py-3 rounded-xl">
              <Lock size={16} />
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
        style: { borderRadius: "14px", background: "#fff7ed", color: "#c2410c", fontWeight: "700", fontSize: "14px", border: "1px solid #fed7aa" }
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
    <div
      className="min-h-screen font-['Outfit',sans-serif]"
      style={{
        background: "linear-gradient(135deg, #fffbf5 0%, #fff8ee 40%, #fdf6f0 100%)",
        fontFamily: "'Outfit', 'DM Sans', sans-serif"
      }}
    >
      {/* FONT IMPORT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif !important; }
      `}</style>

      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-orange-100/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
              <HomeIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-gray-800 leading-none">SGGS <span className="text-orange-500 playfair italic font-bold">StayPG</span></p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none mt-1">Campus Living Portal</p>
            </div>
          </div>

          {/* CENTER LIVE CLOCK */}
          <div className="hidden md:flex items-center gap-3 bg-orange-50 px-5 py-2.5 rounded-full border border-orange-100">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-600 tracking-wider">{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-sm text-gray-400">|</span>
            <MapPin size={14} className="text-orange-400" />
            <span className="text-sm font-semibold text-gray-600">Nanded Campus</span>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-11 h-11 bg-white border border-orange-100 rounded-xl flex items-center justify-center hover:border-orange-300 transition-colors shadow-sm"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-orange-50 p-5 z-50"
                  >
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Notifications</p>
                    {[
                      { icon: "🏠", msg: "Sahyadri Block D — 2 rooms just freed up", time: "5m ago" },
                      { icon: "💳", msg: "Your last booking receipt is ready", time: "1h ago" },
                      { icon: "📢", msg: "Hostel maintenance: Block A, Sun 6–8am", time: "Yesterday" },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-4 py-3 border-b border-gray-50 last:border-none">
                        <span className="text-2xl">{n.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 leading-snug">{n.msg}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
           {/* Home.js ke navbar mein Avatar section ko aise update karo */}
       <div 
            onClick={() => navigate("/dashboard")} 
            className="flex items-center gap-3 bg-white border border-orange-100 rounded-xl px-4 py-2 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-300 transition-all"
            >
           <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-white text-sm font-black">
            {user.name[0]}
             </div>
            <span className="text-base font-bold text-gray-800">{user.name.split(' ')[0]}</span>
           </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Home.js ke navbar mein Avatar section ko aise update karo */}


        {/* ── HERO SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 rounded-[40px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)",
            border: "1.5px solid #fed7aa"
          }}
        >
          {/* decorative circles */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-amber-500" />
                <span className="text-xs font-black text-amber-600 uppercase tracking-[0.15em]">SGGS Institute of Engineering</span>
              </div>
              <h1 className="playfair text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
                Find your <span className="italic text-orange-500">perfect</span> stay
              </h1>
              <p className="text-base text-gray-600 font-medium max-w-lg leading-relaxed">
                Browse, explore and book hostel rooms across all campus blocks — directly from your phone.
              </p>

              {/* SEARCH BAR */}
              <div className="mt-8 flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-md border border-orange-100 w-full max-w-md">
                <Search size={18} className="text-orange-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search blocks, wings..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 outline-none text-base font-medium text-gray-700 bg-transparent placeholder-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                )}
              </div>
            </div>

            {/* STAT PILLS */}
            <div className="flex flex-col gap-4 flex-shrink-0 w-full md:w-auto">
              <StatPill icon={<Building2 size={20} className="text-sky-500" />}  label="Male Rooms"   value={`${maleCount} Available`}   color="bg-sky-50" />
              <StatPill icon={<Users size={20} className="text-rose-400" />}     label="Female Rooms" value={`${femaleCount} Available`}  color="bg-rose-50" />
              <StatPill icon={<Star size={20} className="text-amber-500" />}     label="Avg Rating"   value={`★ ${avgRating} / 5.0`}      color="bg-amber-50" />
              <StatPill icon={<Shield size={20} className="text-emerald-500" />} label="Campus Safe"  value="24/7 Security"               color="bg-emerald-50" />
            </div>
          </div>
        </motion.div>

        {/* ── FILTER BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center mb-10"
        >
          {/* Gender Filter */}
          <div className="flex bg-white rounded-2xl p-1.5 border border-orange-100 shadow-sm gap-1">
            {[
              { val: "all",    label: "All Blocks" },
              { val: "male",   label: "♂ Male" },
              { val: "female", label: "♀ Female" },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setFilter(opt.val)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase transition-all ${
                  filter === opt.val
                    ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex bg-white rounded-2xl p-1.5 border border-orange-100 shadow-sm gap-1">
            {[
              { val: "default", label: "Default" },
              { val: "rating",  label: "★ Rating" },
              { val: "rooms",   label: "Most Rooms" },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setSortBy(opt.val)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase transition-all ${
                  sortBy === opt.val
                    ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <span className="text-sm font-semibold text-gray-500 ml-2">{visible.length} properties found</span>
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
              className="text-center py-32"
            >
              <p className="text-6xl mb-6">🔍</p>
              <p className="text-lg font-bold text-gray-500">No results found for "{search}"</p>
              <button onClick={() => setSearch("")} className="mt-5 text-orange-500 text-sm font-bold underline hover:text-orange-600 transition-colors">Clear your search</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INFO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
          style={{ background: "linear-gradient(135deg, #fff7ed, #fef3c7)", border: "1.5px solid #fde68a" }}
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Calendar size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-800 mb-1">Academic Year 2024–25 Bookings Open</p>
              <p className="text-sm text-gray-600 font-medium mt-1">New allotments are being processed. Book early to secure your preferred block.</p>
            </div>
          </div>
          <button className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-lg shadow-amber-200 hover:from-amber-500 hover:to-orange-500 transition-all">
            View Schedule <ChevronRight size={18} />
          </button>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-xs text-gray-400 font-bold tracking-widest uppercase pb-10">
          SGGS StayPG · Vishnupuri, Nanded · Campus Hostel Management System
        </div>
      </div>
    </div>
  );
}