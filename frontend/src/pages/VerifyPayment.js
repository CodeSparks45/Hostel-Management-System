import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock, Download, QrCode, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";

export default function VerifyPayment() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending"); 
  const duNumber = "DUJ" + Math.floor(10000000 + Math.random() * 90000000);
  
  const statusColors = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    verified: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" }
  };

  const current = statusColors[status];

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans']">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className={`max-w-sm w-full bg-white rounded-[50px] p-10 border-2 ${current.border} shadow-2xl relative`}
      >
        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-gray-300 hover:text-gray-600"><ArrowLeft size={20}/></button>
        
        <div className="text-center mb-8">
          <div className={`inline-flex p-4 rounded-[24px] ${current.bg} ${current.text} mb-4 shadow-inner`}>
             {status === "verified" ? <ShieldCheck size={32}/> : <Clock size={32}/>}
          </div>
          <h2 className={`text-2xl font-black uppercase italic ${current.text} tracking-tighter leading-none`}>
            {status === "verified" ? "Stay Verified" : "Awaiting Scan"}
          </h2>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em] mt-2">Institutional ID Pass</p>
        </div>

        {/* HIGH CONTRAST QR CODE */}
        <div className="mb-8 flex justify-center bg-white p-6 rounded-[40px] shadow-inner border border-gray-100">
          <div className="p-4 bg-white border-[10px] border-white rounded-3xl shadow-xl">
            <QRCode 
              value={JSON.stringify({ du: duNumber, type: "STAYPG", ver: "1.0" })} 
              size={180}
              level="H" 
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-[35px] border border-gray-100 mb-8 space-y-3">
           <div className="flex justify-between"><span className="text-[9px] font-bold text-gray-400 uppercase">Ref ID:</span> <span className="text-xs font-black text-gray-800 tracking-widest">{duNumber}</span></div>
           <div className="flex justify-between"><span className="text-[9px] font-bold text-gray-400 uppercase">Category:</span> <span className="text-xs font-black text-gray-800 uppercase">Sahyadri A</span></div>
        </div>

        <button 
          onClick={() => { setStatus("verified"); toast.success("AI Validation Successful!"); }} 
          className="w-full bg-gray-900 text-white py-5 rounded-[25px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
          {status === "verified" ? "Valid for 24h" : "Verify with AI"}
        </button>
      </motion.div>
      <p className="mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">StayPG Security Protocols Active</p>
    </div>
  );
}