import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, CreditCard, User, HeartPulse,
  MapPin, ShieldAlert, ArrowRight, Loader2, BookOpen,
  CheckCircle2, Edit3, GraduationCap, Droplets, Building2, Calendar
} from "lucide-react";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import SggsLogo from "./sggs-logo.png";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [savedUser, setSavedUser] = useState(null);
  const [formData, setFormData] = useState({
    phone: "", collegeId: "", gender: "male",
    bloodGroup: "", guardianName: "", emergencyPhone: "",
    address: "", course: "", year: ""
  });

  // Check if profile already exists
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.collegeId && stored?.phone) {
      setSavedUser(stored);
      setProfileSaved(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.put("/api/auth/complete-profile", formData);
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSavedUser(updatedUser);
      toast.success("Profile secured! 🎉");
      setTimeout(() => {
        setIsSubmitting(false);
        setProfileSaved(true);
      }, 800);
    } catch (err) {
      toast.error("Profile update failed. Check network.");
      setIsSubmitting(false);
    }
  };

  // ─── PROFILE VIEW ────────────────────────────────────────
  if (profileSaved && savedUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Toaster position="top-right" />

        {/* Header */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={SggsLogo} alt="SGGS Logo" className="w-9 object-contain" />
              <div>
                <p className="text-base font-extrabold text-slate-800 leading-none">StayPG</p>
                <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-1">Institutional</p>
              </div>
            </div>
            <button onClick={() => setProfileSaved(false)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-sky-50 hover:text-sky-600 border border-slate-100 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 transition-all">
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Profile Hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-sky-500 to-teal-400 rounded-[2rem] p-8 mb-6 relative overflow-hidden shadow-xl shadow-sky-500/20 border border-sky-400">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full blur-[60px] opacity-20 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
                {savedUser.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{savedUser.name}</h2>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/30">
                    {savedUser.role || "Student"}
                  </span>
                </div>
                <p className="text-sky-100 text-sm font-medium">{savedUser.email}</p>
                <p className="text-sky-100 text-sm font-medium mt-1">SGGSIE&T, Vishnupuri, Nanded</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2.5 rounded-xl">
                  <p className="text-[10px] text-sky-100 font-bold uppercase tracking-widest">College ID</p>
                  <p className="text-base font-extrabold text-white">{savedUser.collegeId || "—"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <BookOpen size={17} className="text-sky-500" /> Academic Identity
              </h3>
              <div className="space-y-4">
                <ProfileField icon={<GraduationCap size={16} />} label="Course" value={savedUser.course || "—"} color="text-sky-500" />
                <ProfileField icon={<Calendar size={16} />} label="Year" value={savedUser.year || "—"} color="text-sky-500" />
                <ProfileField icon={<Phone size={16} />} label="Mobile" value={savedUser.phone || "—"} color="text-sky-500" />
                <ProfileField icon={<Droplets size={16} />} label="Blood Group" value={savedUser.bloodGroup || "—"} color="text-rose-500" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <ShieldAlert size={17} className="text-rose-500" /> Emergency & Guardian
              </h3>
              <div className="space-y-4">
                <ProfileField icon={<User size={16} />} label="Guardian" value={savedUser.guardianName || "—"} color="text-slate-500" />
                <ProfileField icon={<Phone size={16} />} label="Emergency" value={savedUser.emergencyPhone || "—"} color="text-rose-500" />
                <ProfileField icon={<MapPin size={16} />} label="Address" value={savedUser.address || "—"} color="text-slate-500" />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all">
                <Building2 size={18} /> Go to Dashboard
              </button>
              <button onClick={() => navigate("/home")}
                className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 py-4 rounded-2xl text-sm font-bold border border-slate-100 shadow-sm transition-all">
                <Building2 size={18} /> Explore Hostels
              </button>
              <button onClick={() => navigate("/my-bookings")}
                className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 py-4 rounded-2xl text-sm font-bold border border-slate-100 shadow-sm transition-all">
                <CheckCircle2 size={18} /> My Bookings
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM VIEW ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img src={SggsLogo} alt="SGGS Logo" className="w-9 object-contain" />
          <div>
            <p className="text-base font-extrabold text-slate-800 leading-none">Institutional Profile</p>
            <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-1">Required for Hostel Allocation</p>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress hint */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-sky-50 border border-sky-100 rounded-2xl">
          <div className="w-9 h-9 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-sky-800">Takes only 30 seconds</p>
            <p className="text-xs font-medium text-sky-600">Fill in the basics — this data is securely shared only with the Rector's Office.</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Section 1 */}
            <div>
              <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                <BookOpen size={17} className="text-sky-500" /> Academic Identity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField icon={<CreditCard />} label="Registration / College ID" placeholder="e.g. 2022BTECS000" uppercase
                  onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })} />
                <SelectField icon={<GraduationCap />} label="Course" options={["B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year", "M.Tech", "Ph.D"]}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })} />
                <InputField icon={<Phone />} label="Your Mobile Number" placeholder="+91 98765 43210"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <SelectField icon={<HeartPulse />} label="Blood Group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} />
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                <ShieldAlert size={17} className="text-rose-500" /> Emergency & Guardian Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField icon={<User />} label="Guardian Name" placeholder="Full Name"
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} />
                <InputField icon={<Phone />} label="Emergency Contact" placeholder="Parent/Guardian Phone"
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })} />
                <div className="md:col-span-2">
                  <InputField icon={<MapPin />} label="Permanent Residential Address" placeholder="House No, Street, City, State, PIN"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4.5 py-[1.1rem] rounded-2xl font-extrabold uppercase text-sm tracking-[0.15em] shadow-lg shadow-sky-500/30 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Lock & Submit Profile <ArrowRight size={18} /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 flex-shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function InputField({ icon, label, placeholder, uppercase, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400">{React.cloneElement(icon, { size: 17 })}</div>
        <input required type="text" placeholder={placeholder} onChange={onChange}
          className={`w-full py-3.5 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700 ${uppercase ? "uppercase" : ""}`} />
      </div>
    </div>
  );
}

function SelectField({ icon, label, options, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">{React.cloneElement(icon, { size: 17 })}</div>
        <select required onChange={onChange} defaultValue=""
          className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer">
          <option value="" disabled>Select Option</option>
          {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}