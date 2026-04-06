import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Wifi, Coffee, Shield, MapPin, Star, ArrowLeft, 
  Navigation, Users, Clock, Camera, ChevronRight,
  CheckCircle2, Globe, Heart, Sparkles, HelpCircle, X, ListChecks
} from "lucide-react";
import toast from "react-hot-toast";

/* ─── IMPORT REAL IMAGES ─── */
import boys1 from "./boys_hostel1.jpeg";
import boys2 from "./boys_hostel2.jpeg";
import boys3 from "./boys_hostel3.jpeg";

export default function Explorer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [userLocation, setUserLocation] = useState("Determining...");
  const [liked, setLiked] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation(`${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`),
        () => setUserLocation("Nanded, MH")
      );
    }
  }, []);

  const tabs = ["Overview", "Amenities", "Location", "Reviews"];
  
  const reviews = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    user: `Alumni Resident '${95 + i}`,
    comment: "Maintaining the same standard of excellence for decades. The best academic environment in the region.",
    date: "Spring 2026"
  }));

  const roomImages = [boys1, boys2, boys3];

  const handleSecureCheckout = () => {
    const loadingToast = toast.loading("Connecting to SBI Secure Servers...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      navigate(`/payment-gateway/${id || 'sahyadri-elite'}/450`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans text-slate-800 pb-24">
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-sky-50 rounded-full transition-all text-slate-400 hover:text-sky-600">
              <ArrowLeft size={24}/>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-none text-slate-800">Sahyadri Elite</h1>
              <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mt-1">Institutional Block A</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full border border-sky-100 shadow-sm">
                  <Globe size={16} className="text-sky-500 animate-pulse"/>
                  <span className="text-xs font-bold text-slate-500 tracking-wider">{userLocation}</span>
              </div>
              <button onClick={() => setLiked(!liked)} className="p-3 bg-white rounded-full shadow-sm border border-slate-100 hover:scale-110 transition-transform">
                  <Heart size={20} className={liked ? "fill-rose-500 text-rose-500" : "text-slate-300"} />
              </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ─── IMAGE GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
          <div className="md:col-span-7 h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-md relative group border border-sky-100">
            <img src={roomImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main Room View" />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-slate-800 text-xs font-bold flex items-center gap-2 shadow-lg border border-white">
                <Camera size={16} className="text-sky-500"/> 360° VIEW ACTIVE
            </div>
          </div>
          
          <div className="md:col-span-5 grid grid-rows-2 gap-4 h-[400px] lg:h-[500px]">
            <div className="rounded-[2rem] overflow-hidden border border-sky-100 shadow-sm">
                <img src={roomImages[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Room Detail 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[2rem] overflow-hidden border border-sky-100 shadow-sm">
                    <img src={roomImages[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Room Detail 2" />
                </div>
                <div className="bg-gradient-to-br from-sky-400 to-teal-400 rounded-[2rem] flex flex-col items-center justify-center text-white p-4 group cursor-pointer overflow-hidden relative shadow-md">
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="relative z-10 text-4xl font-black tracking-tighter leading-none">25+</p>
                    <p className="relative z-10 text-xs font-black uppercase tracking-widest mt-2 text-center">Gallery</p>
                </div>
            </div>
          </div>
        </div>

        {/* ─── TAB NAVIGATION ─── */}
        <div className="flex justify-center mb-12">
            <div className="bg-white p-2 rounded-full border border-sky-100 flex gap-2 shadow-sm overflow-x-auto max-w-full">
                {tabs.map(tab => (
                    <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
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
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 text-sky-500">
                        <Sparkles size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Institutional Legacy</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-800">
                      Designed for the <br/><span className="text-teal-500">intellectual elite.</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium max-w-xl">
                      A sanctuary for scholars. Sahyadri offers an environment optimized for deep work, absolute silence, and premium academic networking.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6">
                        <InfoCard icon={<Users size={24}/>} label="Occupancy" value="Premium Single" />
                        <InfoCard icon={<Clock size={24}/>} label="Maintenance" value="24H Automatic" />
                    </div>
                  </div>
                )}

                {/* AMENITIES */}
                {activeTab === "Amenities" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <AmenityBox icon={<Wifi size={28}/>} title="Gigabit WiFi" desc="Low latency connection across all rooms." />
                    <AmenityBox icon={<Coffee size={28}/>} title="Executive Mess" desc="Custom dietary plans curated by top nutritionists." />
                    <AmenityBox icon={<Shield size={28}/>} title="Total Security" desc="Biometric surveillance and 24/7 campus patrol." />
                    <AmenityBox icon={<CheckCircle2 size={28}/>} title="Concierge" desc="24/7 Front desk support for all your needs." />
                  </div>
                )}

                {/* LOCATION */}
                {activeTab === "Location" && (
                    <div className="bg-white rounded-[2.5rem] p-10 border border-sky-100 shadow-xl shadow-sky-100/40 overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="bg-sky-50 inline-block p-4 rounded-2xl text-sky-500 mb-6">
                              <Navigation size={32} />
                            </div>
                            <h3 className="text-3xl font-extrabold text-slate-800 mb-3">Prime Campus Node</h3>
                            <p className="text-base text-slate-500 mb-10 max-w-md leading-relaxed">
                              Located at the absolute heart of SGGSIE&T. Just a 200m walk from the Central Library and the Main Research Wing.
                            </p>
                            <button className="flex items-center gap-3 text-sm font-bold text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors">
                                Get Precise Directions <ArrowLeft size={18} className="rotate-180" />
                            </button>
                        </div>
                        {/* Decorative Map Blur */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-60" />
                    </div>
                )}

                {/* REVIEWS */}
                {activeTab === "Reviews" && (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                    {reviews.map(r => (
                      <div key={r.id} className="bg-white p-8 rounded-[2rem] border border-sky-50 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <p className="font-bold text-sm text-slate-700 uppercase tracking-widest">{r.user}</p>
                           <div className="flex gap-1 text-teal-400">
                             <Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/>
                           </div>
                        </div>
                        <p className="text-base text-slate-500 italic leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 5. SIDEBAR (PREMIUM CHECKOUT CARD) */}
          <div className="lg:col-span-5 relative" style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-sky-100/50 overflow-hidden relative border border-sky-100">
              {/* Premium Glow Effect */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-200 rounded-full blur-[100px] opacity-30 pointer-events-none" />
              
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Total Daily Investment</p>
              <div className="flex items-baseline gap-2 mb-8 border-b border-sky-50 pb-8 relative z-10">
                <span className="text-6xl md:text-7xl font-extrabold text-slate-800 tracking-tighter leading-none">₹450</span>
                <span className="text-base text-slate-400 font-bold uppercase tracking-widest">/ Day</span>
              </div>

              <div className="space-y-5 mb-10 relative z-10">
                <CheckItem text="SBI Collect Direct Integration" />
                <CheckItem text="Institutional Verification Priority" />
                <CheckItem text="Instant Digital Receipt Generation" />
              </div>

              {/* GUIDE TO BOOK BUTTON */}
              <button 
                onClick={() => setShowGuide(true)}
                className="w-full mb-4 border-2 border-sky-100 hover:border-sky-300 hover:bg-sky-50 text-sky-600 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-sm relative z-10"
              >
                <HelpCircle size={16} /> Guide to Book
              </button>

              {/* BOOK NOW BUTTON */}
              <button 
                onClick={handleSecureCheckout}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-xl font-bold uppercase text-sm tracking-[0.2em] shadow-xl shadow-sky-500/30 transition-all flex items-center justify-center gap-3 group active:scale-95 relative z-10"
              >
                Book Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6 flex justify-center items-center gap-2 relative z-10">
                <Shield size={12} className="text-teal-500"/> 256-Bit Bank Level Security
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── GUIDE TO BOOK MODAL ─── */}
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
              className="relative bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl z-10 border border-sky-100"
            >
              <button onClick={() => setShowGuide(false)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="bg-sky-50 text-sky-500 p-4 rounded-2xl">
                  <ListChecks size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800">Booking Guide</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Follow these easy steps</p>
                </div>
              </div>

              <div className="space-y-4">
                <GuideStep num="1" title="Click Book Now" desc="Clicking the button will redirect you to the secure SBI Collect payment portal." />
                <GuideStep num="2" title="Select Institution" desc="Search and select 'Shri Guru Gobind Singhji Institute of Engineering and Technology'." />
                <GuideStep num="3" title="Fill Details" desc="Enter required fields like your Name, Room Type, and Stay Dates." />
                <GuideStep num="4" title="Make Payment" desc="Complete the transaction securely and download your E-Receipt." />
                <GuideStep num="5" title="Get Digital Pass" desc="Return to StayPG, enter your DU Reference Number, and instantly get your QR Pass." />
              </div>

              <button 
                onClick={() => {
                  setShowGuide(false);
                  setTimeout(handleSecureCheckout, 300);
                }}
                className="w-full mt-8 bg-sky-500 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30"
              >
                Understood, Proceed to Book
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bae6fd; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #38bdf8; }
      `}</style>
    </div>
  );
}

// ─── HELPER COMPONENTS ──────────────────────────────────────────────

function GuideStep({ num, title, desc }) {
  return (
    <div className="flex gap-4 items-start bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
       <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5">
          {num}
       </div>
       <div>
          <h4 className="font-bold text-slate-800 text-base mb-1">{title}</h4>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 p-6 bg-white rounded-[1.5rem] border border-sky-100 shadow-sm">
        <div className="text-sky-500 bg-sky-50 p-4 rounded-xl">{icon}</div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-base font-extrabold text-slate-800">{value}</p>
        </div>
    </div>
  );
}

function AmenityBox({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-[2rem] border border-sky-50 hover:border-sky-200 transition-colors shadow-sm h-full group">
        <div className="text-sky-500 bg-sky-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="font-extrabold text-lg text-slate-800 mb-2">{title}</p>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
        <CheckCircle2 size={20} className="text-teal-500 flex-shrink-0" /> 
        <span>{text}</span>
    </div>
  );
}