import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Wifi, Coffee, Shield, MapPin, Star, ArrowLeft, 
  Navigation, Users, Clock, Camera, ChevronRight,
  CheckCircle2, Globe, Heart, Sparkles, HelpCircle, X, 
  ListChecks,ArrowRight, Play
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
  const [userLocation, setUserLocation] = useState("Scanning...");
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

  const roomImages = [boys1, boys2, boys3];

  const handleSecureCheckout = () => {
    const loadingToast = toast.loading("Initializing Secure Payment...", { style: { borderRadius: '16px', background: '#333', color: '#fff' }});
    setTimeout(() => {
      toast.dismiss(loadingToast);
      navigate(`/payment-gateway/${id || 'sahyadri-elite'}/450`);
    }, 1500);
  };

  // Animation Variants
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-['Outfit',sans-serif] text-gray-900 pb-32 selection:bg-orange-500 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&display=swap');
        .playfair { font-family: 'Playfair Display', serif !important; }
        .bento-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ─── FLOATING GLASS NAV ─── */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-4 py-3 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100 transition-all text-gray-600">
            <ArrowLeft size={18}/>
          </button>
          <div className="hidden sm:block pl-2">
            <h1 className="text-base font-black tracking-tight leading-none">Sahyadri Elite</h1>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Block A</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-gray-100/50">
                <Globe size={14} className="text-orange-500 animate-pulse"/>
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{userLocation}</span>
            </div>
            <button onClick={() => setLiked(!liked)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 transition-all hover:scale-105 active:scale-95">
                <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28">
        
        {/* ─── CINEMATIC HERO ─── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="relative w-full h-[60vh] md:h-[75vh] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden group">
            <img src={roomImages[0]} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="Sahyadri Elite" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full mb-4">
                        <Sparkles size={14} className="text-amber-300"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Premium Institutional Stay</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                        Sahyadri <span className="playfair italic font-medium text-orange-400">Elite</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-4 text-white/80">
                        <span className="flex items-center gap-1.5 text-sm font-semibold"><MapPin size={16}/> SGGSIE&T Campus</span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-400"><Star size={16} fill="currentColor"/> 4.8 / 5.0</span>
                    </div>
                </div>

                {/* Floating Thumbnails */}
                <div className="hidden lg:flex gap-3">
                    {roomImages.slice(1, 3).map((img, idx) => (
                        <div key={idx} className="w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-pointer hover:border-white transition-all hover:-translate-y-2">
                            <img src={img} className="w-full h-full object-cover" alt="thumb" />
                        </div>
                    ))}
                    <div className="w-24 h-32 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white hover:text-black transition-all">
                        <Camera size={24} className="mb-2"/>
                        <span className="text-[10px] font-black uppercase tracking-widest">View All</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* ─── STICKY TAB MENU ─── */}
        <div className="sticky top-24 z-50 flex justify-center mt-10 mb-12">
            <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex gap-1 overflow-x-auto hide-scrollbar max-w-full">
                {["Overview", "Amenities", "Location"].map(tab => (
                    <button 
                      key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeTab === tab ? "bg-[#0A0A0A] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                    {tab}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          
          {/* ─── LEFT CONTENT AREA ─── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                
                {/* OVERVIEW CONTENT */}
                {activeTab === "Overview" && (
                  <div className="space-y-10">
                    <h2 className="playfair text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
                      Where focus meets <br/><span className="italic text-orange-500">absolute tranquility.</span>
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed font-light">
                      Designed for scholars who demand excellence. Sahyadri Elite is not just a room; it's a curated environment optimized for deep academic work, featuring soundproofed walls and premium ergonomic furniture.
                    </p>
                    
                    {/* BENTO BOX STATS */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm bento-hover transition-all">
                            <Users size={28} className="text-orange-500 mb-4"/>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Room Type</p>
                            <p className="text-xl font-black text-gray-900">Premium Single</p>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm bento-hover transition-all">
                            <Clock size={28} className="text-orange-500 mb-4"/>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Access Limit</p>
                            <p className="text-xl font-black text-gray-900">24H Automated</p>
                        </div>
                    </div>
                  </div>
                )}

                {/* AMENITIES BENTO GRID */}
                {activeTab === "Amenities" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AmenityBento icon={<Wifi size={32}/>} title="Gigabit WiFi" desc="Enterprise-grade Starlink connection in every room." color="bg-blue-50 text-blue-500" />
                    <AmenityBento icon={<Coffee size={32}/>} title="Executive Mess" desc="Custom nutritional plans served in-house." color="bg-orange-50 text-orange-500" />
                    <AmenityBento icon={<Shield size={32}/>} title="Zero Intrusion" desc="Biometric locks and 24/7 digital surveillance." color="bg-emerald-50 text-emerald-500" />
                    <AmenityBento icon={<CheckCircle2 size={32}/>} title="Room Service" desc="Weekly cleaning and laundry included." color="bg-purple-50 text-purple-500" />
                  </div>
                )}

                {/* LOCATION AREA */}
                {activeTab === "Location" && (
                    <div className="bg-white rounded-[2.5rem] p-2 border border-gray-100 shadow-sm overflow-hidden relative group cursor-pointer">
                        <div className="h-[300px] bg-gray-100 rounded-[2rem] overflow-hidden relative">
                           {/* Placeholder for actual Map Integration */}
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white p-4 rounded-full shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                                 <div className="bg-orange-500 text-white p-4 rounded-full"><MapPin size={32} /></div>
                              </div>
                           </div>
                           <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50">
                               <h3 className="text-xl font-black text-gray-900">Prime Campus Node</h3>
                               <p className="text-sm text-gray-500 mt-1">200m from Central Library, SGGSIE&T.</p>
                           </div>
                        </div>
                    </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── RIGHT SIDEBAR (THE ULTRA-PREMIUM CHECKOUT) ─── */}
          <div className="lg:col-span-5 xl:col-span-4 relative" style={{ alignSelf: 'start', position: 'sticky', top: '140px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="bg-[#0A0A0A] text-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#222] relative overflow-hidden"
            >
              {/* Subtle Glowing Background */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Total Investment</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-white tracking-tighter">₹450</span>
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-widest">/ Day</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 mb-10 pb-8 border-b border-gray-800">
                <div className="flex items-center gap-4 text-sm font-medium text-gray-300"><CheckCircle2 size={18} className="text-orange-500" /> Official SBI Collect Integration</div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-300"><CheckCircle2 size={18} className="text-orange-500" /> Instant Digital Pass Generation</div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-300"><CheckCircle2 size={18} className="text-orange-500" /> Priority Campus Verification</div>
              </div>

              {/* GUIDE BUTTON (Sleek Outline) */}
              <button 
                onClick={() => setShowGuide(true)}
                className="w-full mb-4 border border-gray-700 hover:border-gray-400 hover:bg-white/5 text-gray-300 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all flex justify-center items-center gap-2 group"
              >
                <HelpCircle size={16} className="text-gray-500 group-hover:text-white transition-colors" /> View Booking Guide
              </button>

              {/* MAIN BOOK BUTTON (Animated Gradient) */}
              <button 
                onClick={handleSecureCheckout}
                className="relative w-full overflow-hidden bg-white text-black py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                <span className="relative z-10 flex items-center gap-2">Book Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                {/* Swipe hover effect inside button */}
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                <span className="absolute z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">Book Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              
              <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-6 flex justify-center items-center gap-2">
                <Shield size={12}/> Protected by SBI 256-Bit SSL
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ─── PREMIUM MODAL OVERLAY ─── */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowGuide(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-xl w-full shadow-2xl z-10 border border-white"
            >
              <button onClick={() => setShowGuide(false)} className="absolute top-6 right-6 p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>

              <div className="mb-8">
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <ListChecks size={28} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">How to Book</h3>
                <p className="text-sm font-medium text-gray-500 mt-2">Follow these 5 simple steps to secure your premium stay.</p>
              </div>

              <div className="space-y-4 mb-10">
                <GuideRow num="1" title="Click 'Book Now'" desc="You will be securely redirected to the official SBI Collect portal." />
                <GuideRow num="2" title="Select Institution" desc="Search for 'Shri Guru Gobind Singhji Institute of Engineering and Technology'." />
                <GuideRow num="3" title="Fill Details" desc="Enter your Name, Contact Number, DOB, and verify the amount." />
                <GuideRow num="4" title="Payment & Receipt" desc="Complete the transaction via UPI/Card and save your DU Reference Number." />
                <GuideRow num="5" title="Generate Digital Pass" desc="Return to StayPG, enter your DU Number, and get your Instant QR Pass." />
              </div>

              <button 
                onClick={() => { setShowGuide(false); setTimeout(handleSecureCheckout, 400); }}
                className="w-full bg-[#0A0A0A] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Understood, Proceed
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PREMIUM HELPER COMPONENTS ───

function AmenityBento({ icon, title, desc, color }) {
  return (
    <div className="p-8 bg-white rounded-[2rem] border border-gray-100 hover:border-gray-200 transition-all shadow-sm bento-hover group">
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <h4 className="font-black text-xl text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function GuideRow({ num, title, desc }) {
  return (
    <div className="flex gap-5 items-start p-4 hover:bg-gray-50 rounded-2xl transition-colors">
       <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm flex-shrink-0 mt-1">
          {num}
       </div>
       <div>
          <h4 className="font-bold text-gray-900 text-base">{title}</h4>
          <p className="text-sm font-medium text-gray-500 mt-1 leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}