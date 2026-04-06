import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Siren, PhoneCall, ShieldAlert, 
  MapPin, HeartPulse, AlertOctagon, Info
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SOS() {
  const navigate = useNavigate();
  const [alertSent, setAlertSent] = useState(false);
  const [location, setLocation] = useState("Scanning GPS Coordinates...");

  // Simulate grabbing the student's live location on campus
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("Block A, Sahyadri Hostel, SGGSIE&T Campus");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTriggerSOS = () => {
    if (alertSent) return;
    setAlertSent(true);
    
    // High-priority red toast notification
    toast("EMERGENCY ALERT BROADCASTED!", {
      icon: '🚨',
      style: {
        borderRadius: '16px',
        background: '#ef4444',
        color: '#fff',
        fontWeight: '900',
        padding: '16px',
      },
    });
  };

  return (
    <div className="min-h-screen bg-rose-50/30 font-sans text-slate-800 pb-20 selection:bg-rose-500 selection:text-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* ─── NAV BAR ─── */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-rose-100 shadow-sm">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-rose-50 hover:text-rose-600 border border-slate-100 transition-all text-slate-500"
          >
            <ArrowLeft size={20}/>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">Emergency SOS</h1>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">Campus Security Network</p>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-10">
        
        {/* ─── ALERT STATUS BAR ─── */}
        <div className="bg-white rounded-2xl p-4 flex items-start gap-4 border border-rose-100 shadow-sm mb-10">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">When to use this?</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
              Press the SOS button only in case of a medical emergency, fire, or immediate threat to safety. This will instantly alert the Rector, Campus Security, and nearby wardens with your live location.
            </p>
          </div>
        </div>

        {/* ─── MAIN SOS TRIGGER BUTTON ─── */}
        <div className="flex flex-col items-center justify-center py-10 mb-10">
          <div className="relative flex items-center justify-center">
            
            {/* Background pulsing rings */}
            {!alertSent && (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} 
                  className="absolute w-48 h-48 bg-rose-500 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} 
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }} 
                  className="absolute w-48 h-48 bg-rose-400 rounded-full"
                />
              </>
            )}

            {/* Actual Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTriggerSOS}
              disabled={alertSent}
              className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white transition-colors duration-500 ${
                alertSent 
                ? "bg-slate-800 shadow-slate-900/50" 
                : "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-600/50 hover:from-rose-600 hover:to-red-700"
              }`}
            >
              <Siren size={56} className={`mb-2 ${alertSent ? "text-rose-500" : "text-white"}`} />
              <span className="font-black text-2xl tracking-widest uppercase">
                {alertSent ? "Sent" : "SOS"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">
                {alertSent ? "Help is on the way" : "Tap to Trigger"}
              </span>
            </motion.button>
          </div>

          {/* Location Status below button */}
          <div className="mt-12 flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm border border-slate-100">
            <MapPin size={16} className={alertSent ? "text-rose-500" : "text-slate-400"} />
            <span className={`text-xs font-bold tracking-wide ${alertSent ? "text-rose-600" : "text-slate-500"}`}>
              {location}
            </span>
          </div>
        </div>

        {/* ─── QUICK DIAL CONTACTS ─── */}
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Quick Emergency Dial</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <ContactCard 
              icon={<ShieldAlert size={24} />} 
              title="Campus Security" 
              number="02462-229234" 
              color="bg-slate-800 text-white" 
              iconColor="text-white"
            />
            
            <ContactCard 
              icon={<HeartPulse size={24} />} 
              title="Medical Emergency" 
              number="108 (Ambulance)" 
              color="bg-white" 
              iconColor="text-rose-500"
              border="border border-rose-100"
            />
            
            <ContactCard 
              icon={<AlertOctagon size={24} />} 
              title="Local Police" 
              number="100 / 112" 
              color="bg-white" 
              iconColor="text-sky-500"
              border="border border-sky-100"
            />
            
            <ContactCard 
              icon={<PhoneCall size={24} />} 
              title="Chief Rector" 
              number="+91 98765 43210" 
              color="bg-white" 
              iconColor="text-amber-500"
              border="border border-amber-100"
            />

          </div>
        </div>

      </main>
    </div>
  );
}

// ─── HELPER COMPONENT ───

function ContactCard({ icon, title, number, color, iconColor, border = "" }) {
  return (
    <a href={`tel:${number.replace(/[^0-9+]/g, '')}`} className={`p-5 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] ${color} ${border}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color === 'bg-white' ? 'bg-slate-50' : 'bg-white/10'}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div>
          <h4 className={`font-bold text-sm ${color === 'bg-white' ? 'text-slate-800' : 'text-white'}`}>{title}</h4>
          <p className={`text-xs font-bold tracking-widest mt-0.5 ${color === 'bg-white' ? 'text-slate-400' : 'text-slate-300'}`}>{number}</p>
        </div>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color === 'bg-white' ? 'bg-slate-50 text-slate-400' : 'bg-white/10 text-white'}`}>
        <PhoneCall size={14} />
      </div>
    </a>
  );
}