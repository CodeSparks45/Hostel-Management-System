import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ShieldCheck, ArrowLeft, Camera, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GuardScanner() {
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // QR Scanner Initialize
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      // Jab QR Scan ho jaye
      scanner.clear(); 
      // Yahan hum decode kar rahe hain: "STAYPG-DU123-SAHYADRI"
      const data = decodedText.split("-");
      setScanResult({
        duNumber: data[1] || "N/A",
        hostel: data[2] || "Unknown",
        time: new Date().toLocaleTimeString()
      });
    }

    function onScanError(err) {
      // Console clean rakhne ke liye error silent rakha hai
    }

    return () => scanner.clear();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center font-['Inter']">
      
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-10">
        <button onClick={() => navigate("/")} className="p-2 bg-slate-900 rounded-full text-slate-400">
          <ArrowLeft size={20}/>
        </button>
        <h1 className="text-sm font-black tracking-[0.3em] text-slate-500 uppercase">Guard Terminal</h1>
        <div className="w-10"></div>
      </div>

      {!scanResult ? (
        <div className="w-full max-w-sm">
          <div className="bg-slate-900 p-6 rounded-[40px] border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Camera size={20} className="text-orange-500 animate-pulse"/>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Live Feed...</p>
            </div>
            
            {/* YE DIV CAMERA KHULEGA */}
            <div id="reader" className="overflow-hidden rounded-3xl border-0 bg-black"></div>
            
            <p className="text-center text-[9px] text-slate-600 mt-6 font-bold uppercase tracking-tighter italic">
              Align the StayPG QR within the frame to verify
            </p>
          </div>
        </div>
      ) : (
        /* SUCCESS MODAL */
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-white text-slate-900 rounded-[50px] p-10 shadow-2xl">
          <div className="flex justify-center -mt-20 mb-8">
            <div className="bg-green-500 p-6 rounded-full border-[10px] border-slate-950 text-white shadow-xl">
              <ShieldCheck size={40}/>
            </div>
          </div>
          
          <h2 className="text-center text-3xl font-black mb-2 uppercase italic tracking-tighter">Verified</h2>
          <p className="text-center text-green-500 font-bold text-[10px] uppercase tracking-widest mb-10">Access Granted to Hostel</p>

          <div className="space-y-4 border-t border-gray-50 pt-8">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Reference</span>
              <span className="font-black text-sm">{scanResult.duNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Location</span>
              <span className="font-black text-sm uppercase">{scanResult.hostel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Scan Time</span>
              <span className="font-black text-sm text-blue-600">{scanResult.time}</span>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full mt-10 bg-slate-950 text-white py-5 rounded-[25px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3"
          >
            <RefreshCw size={16}/> Next Scan
          </button>
        </motion.div>
      )}
    </div>
  );
}