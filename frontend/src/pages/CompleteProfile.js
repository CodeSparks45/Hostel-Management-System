import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, CreditCard, Briefcase, VenusAndMars, 
  ShieldCheck, Sparkles, CheckCircle, ArrowRight, Building2 
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    collegeId: "",
    gender: "",
    role: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.put("/api/auth/complete-profile", formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Identity Verified & Profile Ready!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      toast.error("Profile update failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-['Outfit',sans-serif] flex text-gray-900 selection:bg-orange-500 selection:text-white">
      {/* FONT IMPORT FOR CONSISTENCY */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        * { font-family: 'Outfit', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif !important; }
      `}</style>

      {/* ─── LEFT PANEL: BRANDING & TRUST (Hidden on Mobile) ─── */}
      <div className="hidden lg:flex w-5/12 bg-[#0B1727] relative flex-col justify-between p-12 overflow-hidden border-r border-gray-800">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-600 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 flex items-center gap-3">
           <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/50">
              <Building2 size={24} className="text-white" />
           </div>
           <div>
              <p className="text-2xl font-black text-white leading-none tracking-tight">SGGS <span className="text-orange-500 playfair italic">StayPG</span></p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Institutional Network</p>
           </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full mb-6">
             <Sparkles size={14} className="text-amber-400"/>
             <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Final Step</span>
          </div>
          <h1 className="playfair text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-6">
            Complete your <br/><span className="text-orange-400 italic">academic profile.</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
            To ensure the highest security and allocate the correct residential block, we require your verified institutional details.
          </p>
        </motion.div>

        {/* Trust Signals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="relative z-10 space-y-4">
           <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
              <CheckCircle size={18} className="text-emerald-500" /> Only verified SGGS personnel.
           </div>
           <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
              <ShieldCheck size={18} className="text-blue-500" /> End-to-end encrypted data.
           </div>
        </motion.div>
      </div>

      {/* ─── RIGHT PANEL: THE FORM ─── */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-6 md:p-12 relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Building2 size={20} className="text-white" />
           </div>
           <p className="text-xl font-black text-gray-900 tracking-tight">Stay<span className="text-orange-500 playfair italic">PG</span></p>
        </div>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-sm font-black text-orange-500 uppercase tracking-widest mb-2">Step 2 of 2</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Almost there.</h2>
            <p className="text-gray-500 font-medium mb-10">Please provide your institutional credentials to unlock your dashboard.</p>
          </motion.div>

          <motion.form 
            variants={staggerContainer} 
            initial="hidden" 
            animate="show" 
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            {/* Phone */}
            <motion.div variants={fadeInUp} className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1.5 block">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors size-5" />
                <input 
                  type="text" 
                  placeholder="+91 98765 43210" 
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-100 rounded-[20px] outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-300 shadow-sm" 
                  required 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
            </motion.div>

            {/* College ID */}
            <motion.div variants={fadeInUp} className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1.5 block">Institutional ID</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors size-5" />
                <input 
                  type="text" 
                  placeholder="e.g. 2022BTECS000" 
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-100 rounded-[20px] outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-300 shadow-sm uppercase" 
                  required 
                  onChange={(e) => setFormData({...formData, collegeId: e.target.value.toUpperCase()})} 
                />
              </div>
            </motion.div>

            {/* Gender */}
            <motion.div variants={fadeInUp} className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1.5 block">Gender Allocation</label>
              <div className="relative">
                <VenusAndMars className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors size-5 z-10" />
                <select 
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-100 rounded-[20px] outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-gray-800 cursor-pointer shadow-sm appearance-none" 
                  required 
                  defaultValue=""
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="" disabled className="text-gray-300">Select Gender Base</option>
                  <option value="male">Male (Sahyadri Blocks)</option>
                  <option value="female">Female (Nandgiri Units)</option>
                </select>
                {/* Custom Chevron for Select */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </motion.div>

            {/* Designation */}
            <motion.div variants={fadeInUp} className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1.5 block">Designation / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors size-5 z-10" />
                <select 
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-100 rounded-[20px] outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-gray-800 cursor-pointer shadow-sm appearance-none" 
                  required 
                  defaultValue=""
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="" disabled className="text-gray-300">Select Your Role</option>
                  <option value="student">Undergraduate / Scholar</option>
                  <option value="professor">Professor / Faculty</option>
                  <option value="hod">Head of Department</option>
                  <option value="principal">Principal / Director</option>
                  <option value="guest">Official Guest</option>
                </select>
                {/* Custom Chevron for Select */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fadeInUp} className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden bg-gray-900 text-white py-5 rounded-[20px] font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-gray-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                     {isSubmitting ? "Verifying..." : "Access Dashboard"} {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                  {/* Swipe hover effect */}
                  {!isSubmitting && (
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-400 to-amber-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                  )}
                </button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}