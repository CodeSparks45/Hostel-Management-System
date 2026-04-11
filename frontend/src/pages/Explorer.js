import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Wifi, Coffee, Wind, Shield, Star, ArrowLeft,
  Navigation,  Camera, ChevronRight,
  CheckCircle2, Globe, Heart, Sparkles, HelpCircle, X, ListChecks,
  Thermometer, Bed, Building2, MapPin, ThumbsUp, MessageSquare
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import boys1 from "./boys_hostel1.jpeg";
import boys2 from "./boys_hostel2.jpeg";
import boys3 from "./boys_hostel3.jpeg";
import boys4 from "./boys_hostel4.jpeg";
import boys5 from "./boys_hostel5.jpeg";
import boys6 from "./boys_hostel6.jpeg";
import boys7 from "./boys_hostel7.jpeg";
import boys8 from "./boys_hostel8.png";
import girls1 from "./girls_hostel1.png";
import girls2 from "./girls_hostel2.png";

// ── ROOM DATABASE — matches Home.js exactly ──────────────────
const ROOM_DATA = {
  "sahyadri-A4": {
    roomNumber: "A4", hostel: "Sahyadri Boys Hostel", type: "AC",
    gender: "male", price: 550, rating: 4.8, floor: "Ground Floor",
    block: "Block A", capacity: 1,
    title: "Room A4 — AC Premium",
    subtitle: "Sahyadri Boys Hostel · Block A · Ground Floor",
    desc: "Spacious AC room with attached study desk, wardrobe, and 24/7 cooling. Perfect for focused academic work and extended stays. Comes with heavy-duty study furniture.",
    amenities: ["WiFi (100 Mbps)", "Air Conditioning", "Mess Access", "Study Desk", "Wardrobe", "24H Security"],
    amenityIcons: ["wifi", "ac", "mess", "desk", "wardrobe", "shield"],
    images: [boys1, boys2, boys3],
    mongoRoomId: "", // Fill after seeding MongoDB
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Prof. A. Kulkarni", role: "Faculty, E&TC", rating: 5, comment: "Excellent room. Very clean and well-maintained. The AC works perfectly." },
      { name: "Dr. S. Patil", role: "HOD, Computer Science", rating: 5, comment: "Best accommodation on campus. Would recommend to all visiting faculty." },
    ]
  },
  "sahyadri-A10": {
    roomNumber: "A10", hostel: "Sahyadri Boys Hostel", type: "AC",
    gender: "male", price: 550, rating: 4.7, floor: "First Floor",
    block: "Block A", capacity: 1,
    title: "Room A10 — AC Corner Suite",
    subtitle: "Sahyadri Boys Hostel · Block A · First Floor",
    desc: "Corner AC room with garden view. Quiet environment ideal for researchers and visiting faculty. Natural light from two windows creates a refreshing atmosphere.",
    amenities: ["WiFi (100 Mbps)", "Air Conditioning", "Mess Access", "Garden View", "Wardrobe", "24H Security"],
    amenityIcons: ["wifi", "ac", "mess", "view", "wardrobe", "shield"],
    images: [boys2, boys3, boys4],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Dr. R. Sharma", role: "AICTE Inspector", rating: 5, comment: "Corner room with amazing garden view. Very peaceful for reading and work." },
      { name: "Prof. M. Joshi", role: "Visiting Faculty", rating: 4, comment: "Good room, AC is efficient. The view makes mornings very pleasant." },
    ]
  },
  "sahyadri-B4": {
    roomNumber: "B4", hostel: "Sahyadri Boys Hostel", type: "AC",
    gender: "male", price: 550, rating: 4.6, floor: "Ground Floor",
    block: "Block B", capacity: 1,
    title: "Room B4 — AC Standard",
    subtitle: "Sahyadri Boys Hostel · Block B · Ground Floor",
    desc: "Well-maintained AC room in Block B. Close to administrative wing and parking. Ideal for guests attending official college meetings and events.",
    amenities: ["WiFi (100 Mbps)", "Air Conditioning", "Mess Access", "Near Parking", "Wardrobe", "24H Security"],
    amenityIcons: ["wifi", "ac", "mess", "parking", "wardrobe", "shield"],
    images: [boys3, boys4, boys5],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Mr. P. Desai", role: "Official Guest, NAAC", rating: 5, comment: "Convenient location near admin block. Everything was in perfect order." },
    ]
  },
  "sahyadri-B10": {
    roomNumber: "B10", hostel: "Sahyadri Boys Hostel", type: "AC",
    gender: "male", price: 550, rating: 4.9, floor: "First Floor",
    block: "Block B", capacity: 1,
    title: "Room B10 — AC Panoramic",
    subtitle: "Sahyadri Boys Hostel · Block B · First Floor",
    desc: "Premium Block B top-floor AC room with campus panoramic view. Most requested room by senior officials. Premium furnishing with extra storage space.",
    amenities: ["WiFi (100 Mbps)", "Air Conditioning", "Mess Access", "Café Access", "Panoramic View", "24H Security"],
    amenityIcons: ["wifi", "ac", "mess", "cafe", "view", "shield"],
    images: [boys4, boys1, boys2],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Dr. A. Mehta", role: "Principal, VIT College", rating: 5, comment: "Outstanding room. The campus view from the window is breathtaking." },
      { name: "Prof. K. Singh", role: "Board Member", rating: 5, comment: "Most comfortable stay I've had in any campus hostel. Highly recommended." },
    ]
  },
  "sahyadri-A8": {
    roomNumber: "A8", hostel: "Sahyadri Boys Hostel", type: "Non-AC",
    gender: "male", price: 450, rating: 4.4, floor: "Ground Floor",
    block: "Block A", capacity: 1,
    title: "Room A8 — Standard",
    subtitle: "Sahyadri Boys Hostel · Block A · Ground Floor",
    desc: "Standard Non-AC room with ceiling fan and natural ventilation. Budget-friendly option for short stays. Clean and well-maintained with basic amenities.",
    amenities: ["WiFi (100 Mbps)", "Ceiling Fan", "Mess Access", "Study Desk", "Wardrobe", "24H Security"],
    amenityIcons: ["wifi", "fan", "mess", "desk", "wardrobe", "shield"],
    images: [boys5, boys6, boys7],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Mr. R. Kumar", role: "Govt. Official", rating: 4, comment: "Simple but clean room. Very value for money. Staff is cooperative." },
    ]
  },
  "sahyadri-A9": {
    roomNumber: "A9", hostel: "Sahyadri Boys Hostel", type: "Non-AC",
    gender: "male", price: 450, rating: 4.3, floor: "Ground Floor",
    block: "Block A", capacity: 1,
    title: "Room A9 — Standard",
    subtitle: "Sahyadri Boys Hostel · Block A · Ground Floor",
    desc: "Comfortable Non-AC room adjacent to reading hall. Great for early risers who prefer a quiet environment. Natural ventilation keeps the room fresh.",
    amenities: ["WiFi (100 Mbps)", "Ceiling Fan", "Mess Access", "Near Reading Hall", "Wardrobe", "24H Security"],
    amenityIcons: ["wifi", "fan", "mess", "library", "wardrobe", "shield"],
    images: [boys6, boys5, boys8],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Prof. N. Rao", role: "Research Scholar", rating: 4, comment: "Peaceful room near the reading area. Ideal for extended academic visits." },
    ]
  },
  "sahyadri-B8": {
    roomNumber: "B8", hostel: "Sahyadri Boys Hostel", type: "Non-AC",
    gender: "male", price: 450, rating: 4.5, floor: "Ground Floor",
    block: "Block B", capacity: 1,
    title: "Room B8 — Standard Plus",
    subtitle: "Sahyadri Boys Hostel · Block B · Ground Floor",
    desc: "Block B Non-AC room near the common lounge. Social and vibrant atmosphere. Great for guests who want to interact with campus community.",
    amenities: ["WiFi (100 Mbps)", "Ceiling Fan", "Mess Access", "Café Access", "Near Lounge", "24H Security"],
    amenityIcons: ["wifi", "fan", "mess", "cafe", "lounge", "shield"],
    images: [boys7, boys8, boys1],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Dr. V. Nair", role: "Industry Expert", rating: 5, comment: "Great atmosphere. The café nearby is a bonus. Very welcoming environment." },
    ]
  },
  "sahyadri-B9": {
    roomNumber: "B9", hostel: "Sahyadri Boys Hostel", type: "Non-AC",
    gender: "male", price: 450, rating: 4.4, floor: "First Floor",
    block: "Block B", capacity: 1,
    title: "Room B9 — Breezy Standard",
    subtitle: "Sahyadri Boys Hostel · Block B · First Floor",
    desc: "First floor Non-AC room with excellent cross-breeze. Highly preferred during winters and monsoon season. Spacious with good natural light.",
    amenities: ["WiFi (100 Mbps)", "Ceiling Fan", "Mess Access", "Cross Ventilation", "Wardrobe", "24H Security"],
    amenityIcons: ["wifi", "fan", "mess", "breeze", "wardrobe", "shield"],
    images: [boys8, boys7, boys6],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Mr. S. Gupta", role: "Visiting Lecturer", rating: 4, comment: "First floor room with great airflow. Very comfortable in cooler months." },
    ]
  },
  "krishna-A9": {
    roomNumber: "A9", hostel: "Krishna Girls Hostel", type: "Non-AC",
    gender: "female", price: 450, rating: 4.8, floor: "Ground Floor",
    block: "Block A", capacity: 1,
    title: "Room A9 — Secure Standard",
    subtitle: "Krishna Girls Hostel · Block A · Ground Floor",
    desc: "Secure and well-lit Non-AC room in Krishna Girls Hostel with 24/7 dedicated security. Safe and comfortable environment for female faculty and staff.",
    amenities: ["WiFi (100 Mbps)", "Ceiling Fan", "Mess Access", "Dedicated Security", "Wardrobe", "CCTV Covered"],
    amenityIcons: ["wifi", "fan", "mess", "shield", "wardrobe", "cctv"],
    images: [girls1, girls2, girls1],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Dr. S. Kulkarni", role: "HOD, Civil Dept.", rating: 5, comment: "Very safe and comfortable. The security arrangements give complete peace of mind." },
      { name: "Prof. P. Mishra", role: "Visiting Faculty", rating: 5, comment: "Clean, secure, and well-maintained. Excellent for female faculty members." },
    ]
  },
  "krishna-A10": {
    roomNumber: "A10", hostel: "Krishna Girls Hostel", type: "Non-AC",
    gender: "female", price: 450, rating: 4.7, floor: "Ground Floor",
    block: "Block A", capacity: 1,
    title: "Room A10 — Spacious Standard",
    subtitle: "Krishna Girls Hostel · Block A · Ground Floor",
    desc: "Spacious Non-AC room with extra storage space. Peaceful environment perfect for extended stays. Well-ventilated with good natural lighting throughout the day.",
    amenities: ["WiFi (100 Mbps)", "Ceiling Fan", "Mess Access", "Extra Storage", "Wardrobe", "CCTV Covered"],
    amenityIcons: ["wifi", "fan", "mess", "storage", "wardrobe", "cctv"],
    images: [girls2, girls1, girls2],
    mongoRoomId: "",
    checkInTime: "2:00 PM", checkOutTime: "11:00 AM",
    reviews: [
      { name: "Ms. A. Sharma", role: "AICTE Reviewer", rating: 5, comment: "Spacious and clean room. Extra storage was very helpful for my week-long stay." },
    ]
  },
};

const amenityIconMap = {
  wifi: <Wifi size={20} className="text-sky-500" />,
  ac: <Wind size={20} className="text-blue-500" />,
  fan: <Wind size={20} className="text-slate-500" />,
  mess: <span className="text-lg">🍽️</span>,
  cafe: <Coffee size={20} className="text-amber-500" />,
  shield: <Shield size={20} className="text-emerald-500" />,
  desk: <span className="text-lg">🪑</span>,
  wardrobe: <span className="text-lg">🗄️</span>,
  view: <span className="text-lg">🌿</span>,
  parking: <span className="text-lg">🅿️</span>,
  library: <span className="text-lg">📚</span>,
  lounge: <span className="text-lg">🛋️</span>,
  breeze: <span className="text-lg">💨</span>,
  storage: <span className="text-lg">📦</span>,
  cctv: <span className="text-lg">📹</span>,
};

export default function Explorer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState("Overview");
  const [userLocation, setUserLocation] = useState("Nanded, MH");
  const [liked, setLiked]           = useState(false);
  const [showGuide, setShowGuide]   = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const room = ROOM_DATA[id];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation(`${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`),
        () => setUserLocation("Nanded, MH")
      );
    }
    window.scrollTo(0, 0);
  }, [id]);

  // Room not found
  if (!room) {
    return (
      <div className="min-h-screen bg-sky-50/50 flex flex-col items-center justify-center p-6">
        <Building2 size={64} className="text-sky-200 mb-4" />
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Room Not Found</h1>
        <p className="text-slate-500 mb-6">This room doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/home")} className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold">
          Back to Hostels
        </button>
      </div>
    );
  }

  const tabs = ["Overview", "Amenities", "Location", "Reviews"];

  const handleSecureCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to book a room!");
      navigate("/login");
      return;
    }
    const loadingToast = toast.loading("Connecting to SBI Secure Servers...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      // Pass room id and price. hostelId will be set from room.mongoRoomId once DB is seeded
      localStorage.setItem("lastPaymentSession", JSON.stringify({
        hostelId:   room.mongoRoomId || id,
        hostelName: room.hostel,
        roomNumber: room.roomNumber,
        roomType:   room.type,
        price:      room.price,
      }));
      navigate(`/payment-gateway/${room.mongoRoomId || id}/${room.price}`);
    }, 1500);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmittingFeedback(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Feedback submitted! Thank you. ✅");
    setFeedbackText("");
    setFeedbackRating(5);
    setShowFeedback(false);
    setSubmittingFeedback(false);
  };

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans text-slate-800 pb-24">
      <Toaster position="top-right" />

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-sky-50 rounded-full transition-all text-slate-400 hover:text-sky-600">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight leading-none text-slate-800">{room.title}</h1>
              <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mt-0.5">{room.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full border border-sky-100 shadow-sm">
              <Globe size={14} className="text-sky-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500">{userLocation}</span>
            </div>
            <button onClick={() => setShowFeedback(true)} className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-500 hover:text-sky-600 hover:border-sky-200 transition-all">
              <MessageSquare size={14} /> Feedback
            </button>
            <button onClick={() => setLiked(!liked)} className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:scale-110 transition-transform">
              <Heart size={18} className={liked ? "fill-rose-500 text-rose-500" : "text-slate-300"} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ─── IMAGE GALLERY ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
          {/* Main Image */}
          <div className="md:col-span-7 h-[380px] lg:h-[480px] rounded-[2rem] overflow-hidden shadow-md relative group border border-sky-100">
            <img
              src={room.images[activeImage]}
              className="w-full h-full object-cover transition-all duration-500"
              alt={room.title}
            />
            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-slate-800 text-xs font-bold flex items-center gap-2 shadow-lg border border-white">
              <Camera size={14} className="text-sky-500" />
              {room.hostel} · Room {room.roomNumber}
            </div>
            {/* Type Badge on image */}
            <div className={`absolute top-5 left-5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${room.type === "AC" ? "bg-blue-500 text-white" : "bg-slate-700 text-white"}`}>
              {room.type === "AC" ? "❄️ AC Room" : "🌀 Non-AC Room"}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="md:col-span-5 grid grid-rows-2 gap-4 h-[380px] lg:h-[480px]">
            <button
              onClick={() => setActiveImage(1)}
              className={`rounded-[2rem] overflow-hidden border-2 transition-all ${activeImage === 1 ? "border-sky-400 shadow-md" : "border-sky-100 shadow-sm"}`}
            >
              <img src={room.images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="View 2" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveImage(2)}
                className={`rounded-[2rem] overflow-hidden border-2 transition-all ${activeImage === 2 ? "border-sky-400 shadow-md" : "border-sky-100 shadow-sm"}`}
              >
                <img src={room.images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="View 3" />
              </button>
              <button
                onClick={() => setActiveImage(0)}
                className="bg-gradient-to-br from-sky-400 to-teal-400 rounded-[2rem] flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden relative shadow-md group"
              >
                <p className="text-3xl font-black tracking-tighter">3</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-1">Photos</p>
              </button>
            </div>
          </div>
        </div>

        {/* ─── TAB NAVIGATION ─── */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full border border-sky-100 flex gap-1.5 shadow-sm overflow-x-auto max-w-full">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                    : "text-slate-400 hover:bg-sky-50 hover:text-sky-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ─── CONTENT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {/* OVERVIEW */}
                {activeTab === "Overview" && (
                  <div className="space-y-7">
                    <div className="flex items-center gap-2 text-sky-500">
                      <Sparkles size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">{room.hostel}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-slate-800">
                      {room.title}
                    </h2>
                    <p className="text-base text-slate-500 leading-relaxed font-medium max-w-xl">{room.desc}</p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <QuickStat icon={<Bed size={20} />} label="Capacity" value="Single" color="sky" />
                      <QuickStat icon={<Building2 size={20} />} label="Block" value={room.block} color="teal" />
                      <QuickStat icon={<MapPin size={20} />} label="Floor" value={room.floor} color="amber" />
                      <QuickStat icon={<Thermometer size={20} />} label="Type" value={room.type} color={room.type === "AC" ? "blue" : "slate"} />
                    </div>

                    {/* Check-in / Check-out */}
                    <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Stay Information</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Check-in</p>
                          <p className="text-lg font-extrabold text-slate-800">{room.checkInTime}</p>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Check-out</p>
                          <p className="text-lg font-extrabold text-slate-800">{room.checkOutTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AMENITIES */}
                {activeTab === "Amenities" && (
                  <div>
                    <div className="flex items-center gap-2 text-sky-500 mb-6">
                      <CheckCircle2 size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">What's Included</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {room.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-sky-50 hover:border-sky-200 transition-colors shadow-sm group">
                          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                            {amenityIconMap[room.amenityIcons[i]] || <CheckCircle2 size={20} className="text-sky-500" />}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm">{amenity}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Included</p>
                          </div>
                          <CheckCircle2 size={16} className="text-emerald-400 ml-auto flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LOCATION */}
                {activeTab === "Location" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-sky-100 shadow-xl shadow-sky-100/40 overflow-hidden relative">
                      <div className="relative z-10">
                        <div className="bg-sky-50 inline-block p-4 rounded-2xl text-sky-500 mb-6">
                          <Navigation size={28} />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{room.hostel}</h3>
                        <p className="text-sm font-bold text-sky-500 uppercase tracking-widest mb-4">{room.block} · {room.floor}</p>
                        <p className="text-base text-slate-500 mb-8 max-w-md leading-relaxed">
                          Located at SGGSIE&T campus, Vishnupuri, Nanded — 431606, Maharashtra. 
                          Just 5 minutes from main gate and 10 minutes from Nanded Railway Station.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="bg-sky-50 text-sky-600 px-4 py-2 rounded-xl text-xs font-bold border border-sky-100">📍 Vishnupuri, Nanded</span>
                          <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">🚂 10 min from Station</span>
                          <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100">🏫 Inside Campus</span>
                        </div>
                      </div>
                      <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-60" />
                    </div>
                  </div>
                )}

                {/* REVIEWS */}
                {activeTab === "Reviews" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-sky-500">
                        <Star size={18} fill="currentColor" className="text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          {room.rating} · {room.reviews.length} Reviews
                        </span>
                      </div>
                      <button
                        onClick={() => setShowFeedback(true)}
                        className="flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-xl text-xs font-bold border border-sky-100 hover:bg-sky-100 transition-all"
                      >
                        <ThumbsUp size={13} /> Write a Review
                      </button>
                    </div>
                    {room.reviews.map((r, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] border border-sky-50 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-extrabold text-sm text-slate-800">{r.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{r.role}</p>
                          </div>
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 italic leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── BOOKING SIDEBAR ─── */}
          <div className="lg:col-span-5 relative" style={{ alignSelf: "start", position: "sticky", top: "100px" }}>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-sky-100/50 overflow-hidden relative border border-sky-100">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-200 rounded-full blur-[100px] opacity-30 pointer-events-none" />

              {/* Price */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">Daily Rate</p>
              <div className="flex items-baseline gap-2 mb-2 relative z-10">
                <span className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tighter">₹{room.price}</span>
                <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">/ day</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded-full text-xs font-bold border ${room.type === "AC" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                {room.type === "AC" ? "❄️ AC Room" : "🌀 Non-AC Room"} · Room {room.roomNumber}
              </div>

              <div className="border-t border-sky-50 pt-6 mb-6 relative z-10 space-y-3">
                <CheckItem text="SBI Collect Secure Payment" />
                <CheckItem text="Rector Verified Allocation" />
                <CheckItem text="Instant DU Reference Generated" />
                <CheckItem text={`Check-in ${room.checkInTime} · Check-out ${room.checkOutTime}`} />
              </div>

              {/* Guide Button */}
              <button
                onClick={() => setShowGuide(true)}
                className="w-full mb-3 border-2 border-sky-100 hover:border-sky-300 hover:bg-sky-50 text-sky-600 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-2 relative z-10"
              >
                <HelpCircle size={15} /> Booking Guide
              </button>

              {/* Book Button */}
              <button
                onClick={handleSecureCheckout}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4.5 py-[18px] rounded-xl font-bold uppercase text-sm tracking-[0.2em] shadow-xl shadow-sky-500/30 transition-all flex items-center justify-center gap-3 group active:scale-95 relative z-10"
              >
                Book Room {room.roomNumber} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex justify-center items-center gap-2 relative z-10">
                <Shield size={11} className="text-teal-500" /> Secure · Official · SGGSIE&T
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── GUIDE MODAL ─── */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowGuide(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl z-10 border border-sky-100"
            >
              <button onClick={() => setShowGuide(false)} className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-full text-slate-400 transition-colors">
                <X size={18} />
              </button>
              <div className="flex items-center gap-4 mb-7">
                <div className="bg-sky-50 text-sky-500 p-4 rounded-2xl"><ListChecks size={26} /></div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">Booking Guide</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Room {room.roomNumber} · {room.hostel}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { n: "1", t: "Click 'Book Room'", d: "You'll be redirected to SBI Collect — the official payment portal." },
                  { n: "2", t: "Select SGGSIE&T", d: "Choose Maharashtra → Educational Institutions → SGGSIE&T." },
                  { n: "3", t: "Fill Your Details", d: "Enter your name, designation, purpose of visit, and mobile number." },
                  { n: "4", t: "Complete Payment", d: `Pay ₹${room.price} securely. Download your e-Receipt with DU Reference Number.` },
                  { n: "5", t: "Upload Receipt", d: "Return to StayPG → Verify Pass → Upload receipt + DU Number." },
                  { n: "6", t: "Rector Approval", d: "Rector reviews and approves. You'll receive email confirmation with QR Pass." },
                ].map(step => (
                  <div key={step.n} className="flex gap-3 items-start bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">{step.n}</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-0.5">{step.t}</h4>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setShowGuide(false); setTimeout(handleSecureCheckout, 300); }}
                className="w-full mt-6 bg-sky-500 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30"
              >
                Understood — Proceed to Book
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── FEEDBACK MODAL ─── */}
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFeedback(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl z-10 border border-sky-100"
            >
              <button onClick={() => setShowFeedback(false)} className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-full text-slate-400 transition-colors">
                <X size={18} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-50 text-amber-500 p-4 rounded-2xl"><Star size={24} /></div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">Write a Review</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Room {room.roomNumber} · {room.hostel}</p>
                </div>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                {/* Star Rating */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setFeedbackRating(star)}>
                        <Star
                          size={28}
                          className={`transition-colors ${star <= feedbackRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Your Experience</label>
                  <textarea
                    required rows={4}
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Share your stay experience..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white text-sm font-medium text-slate-700 resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback || !feedbackText.trim()}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/30 disabled:opacity-70"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bae6fd; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function QuickStat({ icon, label, value, color }) {
  const colorMap = {
    sky:   "bg-sky-50 text-sky-500",
    teal:  "bg-teal-50 text-teal-500",
    amber: "bg-amber-50 text-amber-500",
    blue:  "bg-blue-50 text-blue-500",
    slate: "bg-slate-50 text-slate-500",
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-sky-50 shadow-sm text-center">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${colorMap[color]}`}>{icon}</div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
      <CheckCircle2 size={16} className="text-teal-500 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}