import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, CreditCard, User, HeartPulse, 
  MapPin, ShieldAlert, ArrowRight, Loader2, BookOpen
} from "lucide-react";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";

import SggsLogo from "./sggs-logo.png"; 

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phone: "", collegeId: "", gender: "", 
    bloodGroup: "", guardianName: "", emergencyPhone: "",
    address: "", course: "", year: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.put("/api/auth/complete-profile", formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Institutional Profile Secured! 🎉");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      toast.error("Profile update failed. Check network.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/50 flex flex-col items-center py-12 px-4 md:px-10 font-sans">
      <Toaster position="top-right" />

      <div className="max-w-4xl w-full">
        <header className="mb-8 text-center flex flex-col items-center">
          <img src={SggsLogo} alt="SGGS Logo" className="w-16 object-contain mb-4 drop-shadow-sm" />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Institutional Profile</h1>
          <p className="text-sm font-bold text-sky-500 uppercase tracking-widest mt-2">Required for Hostel Allocation</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-sky-100 border border-sky-50 p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Academic & Personal */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-sky-500"/> Academic Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<CreditCard/>} label="Registration / College ID" placeholder="e.g. 2022BTECS000" uppercase onChange={(e) => setFormData({...formData, collegeId: e.target.value})} />
                <SelectField icon={<User/>} label="Course & Year" options={["B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year", "M.Tech", "Ph.D"]} onChange={(e) => setFormData({...formData, course: e.target.value})} />
                <InputField icon={<Phone/>} label="Student Mobile Number" placeholder="+91 98765 43210" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <SelectField icon={<HeartPulse/>} label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} />
              </div>
            </div>

            {/* Section 2: Emergency & Guardian */}
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                <ShieldAlert size={20} className="text-rose-500"/> Emergency & Guardian Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField icon={<User/>} label="Guardian Name" placeholder="Full Name" onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
                <InputField icon={<Phone/>} label="Emergency Contact Number" placeholder="Parent/Guardian Phone" onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})} />
                <div className="md:col-span-2">
                  <InputField icon={<MapPin/>} label="Permanent Residential Address" placeholder="House No, Street, City, State, PIN" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-2xl font-extrabold uppercase text-sm tracking-[0.2em] shadow-lg shadow-sky-500/30 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Lock & Submit Profile <ArrowRight size={18}/></>}
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">This data is securely shared only with the Rector's Office.</p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components for clean form
function InputField({ icon, label, placeholder, uppercase, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400">{React.cloneElement(icon, { size: 18 })}</div>
        <input required type="text" placeholder={placeholder} onChange={onChange} className={`w-full py-3.5 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700 ${uppercase ? 'uppercase' : ''}`} />
      </div>
    </div>
  );
}

function SelectField({ icon, label, options, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">{React.cloneElement(icon, { size: 18 })}</div>
        <select required onChange={onChange} defaultValue="" className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer">
          <option value="" disabled>Select Option</option>
          {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}