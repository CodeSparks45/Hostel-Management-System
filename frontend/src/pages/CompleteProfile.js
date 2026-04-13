import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, CreditCard, User, HeartPulse, MapPin, ShieldAlert,
  ArrowRight, Loader2, BookOpen, Edit3, Mail, Building2,
  CheckCircle2, Calendar,CalendarCheck, Shield, LogOut, Camera, Briefcase
} from "lucide-react";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import SggsLogo from "./sggs-logo.png";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("loading"); // loading | form | view
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    phone: "", collegeId: "", gender: "",
    bloodGroup: "", guardianName: "", emergencyPhone: "",
    address: "", course: "", designation: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      // If profile completed, show view mode
      if (stored.profileCompleted && stored.phone) {
        setMode("view");
      } else {
        setMode("form");
      }
    } else {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.gender) {
      toast.error("Phone number and gender are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.put("/api/auth/complete-profile", formData);
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile saved! ✅");
      setTimeout(() => { setMode("view"); }, 800);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  if (mode === "loading") return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  // ── PROFILE VIEW MODE ──────────────────────────────────────────
  if (mode === "view" && user) {
    const roleColors = {
      professor: "bg-sky-50 text-sky-700 border-sky-200",
      hod: "bg-purple-50 text-purple-700 border-purple-200",
      principal: "bg-amber-50 text-amber-700 border-amber-200",
      admin: "bg-rose-50 text-rose-700 border-rose-200",
      guest: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    const roleColor = roleColors[user.role] || roleColors.guest;

    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Toaster position="top-right"/>

        {/* ── HERO HEADER ── */}
        <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-teal-500 pb-28 pt-8 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=.05%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"/>
          <div className="max-w-3xl mx-auto relative z-10">
            {/* Nav */}
            <div className="flex justify-between items-center mb-10">
              <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors">
                <ArrowRight size={16} className="rotate-180"/> Dashboard
              </button>
              <img src={SggsLogo} alt="SGGS" className="w-9 object-contain opacity-90"/>
              <button onClick={handleLogout} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors">
                <LogOut size={15}/> Sign Out
              </button>
            </div>

            {/* Avatar + Name */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <span className="text-4xl font-black text-white">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <button onClick={() => setMode("form")}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100 text-slate-600 hover:text-sky-600 transition-colors">
                  <Edit3 size={14}/>
                </button>
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-1">{user.name}</h1>
              <p className="text-sky-100 font-medium text-sm mb-3">{user.email}</p>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border ${roleColor}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* ── PROFILE CARDS ── */}
        <div className="max-w-3xl mx-auto px-5 -mt-16 pb-12 relative z-10 space-y-4">

          {/* Status Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[1.75rem] p-6 shadow-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account Status</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Profile", value: user.profileCompleted ? "Complete" : "Pending", color: user.profileCompleted ? "text-emerald-600" : "text-amber-600", icon: <CheckCircle2 size={20}/> },
                { label: "Gender", value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "—", color: "text-sky-600", icon: <User size={20}/> },
                { label: "Joined", value: new Date().getFullYear(), color: "text-slate-600", icon: <Calendar size={20}/> },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${stat.color} bg-slate-50`}>{stat.icon}</div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className={`text-sm font-extrabold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[1.75rem] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-extrabold text-slate-800">Contact Information</p>
              <button onClick={() => setMode("form")} className="text-xs font-bold text-sky-500 hover:text-sky-700 flex items-center gap-1">
                <Edit3 size={12}/> Edit
              </button>
            </div>
            <div className="space-y-4">
              {[
                { icon: <Mail size={18}/>, label: "Email", value: user.email, color: "text-sky-500 bg-sky-50" },
                { icon: <Phone size={18}/>, label: "Mobile", value: user.phone || "Not provided", color: "text-emerald-500 bg-emerald-50" },
                { icon: <CreditCard size={18}/>, label: "College ID", value: user.collegeId || "Not provided", color: "text-purple-500 bg-purple-50" },
                { icon: <Briefcase size={18}/>, label: "Role / Designation", value: user.role || "—", color: "text-amber-500 bg-amber-50" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>{item.icon}</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-sm font-extrabold text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Emergency Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-[1.75rem] p-6 shadow-sm border border-slate-100">
            <p className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2">
              <ShieldAlert size={17} className="text-rose-500"/> Emergency Information
            </p>
            <div className="space-y-3">
              {[
                { label: "Guardian Name", value: user.guardianName || "Not provided" },
                { label: "Emergency Contact", value: user.emergencyPhone || "Not provided" },
                { label: "Blood Group", value: user.bloodGroup || "Not provided" },
                { label: "Address", value: user.address || "Not provided" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start py-2.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <span className="text-xs font-extrabold text-slate-700 text-right max-w-[55%]">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate("/my-bookings")}
              className="bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
              <CalendarCheck size={17}/> My Bookings
            </button>
            <button onClick={() => setMode("form")}
              className="bg-white hover:bg-slate-50 text-slate-700 p-4 rounded-2xl font-bold text-sm transition-all shadow-sm border border-slate-100 flex items-center justify-center gap-2">
              <Edit3 size={17}/> Edit Profile
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── FORM MODE ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right"/>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => user?.profileCompleted ? setMode("view") : navigate(-1)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-sky-600 transition-colors">
          <ArrowRight size={18} className="rotate-180"/>
        </button>
        <div className="flex items-center gap-2">
          <img src={SggsLogo} alt="" className="w-7 object-contain"/>
          <span className="font-extrabold text-slate-800 text-sm">Edit Profile</span>
        </div>
        <div className="w-9"/>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/20">
            <span className="text-2xl font-black text-white">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800">{user?.name}</h1>
          <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mt-1">Complete your profile for hostel access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-[1.75rem] p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={14} className="text-sky-500"/> Basic Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FastInput
                icon={<Phone size={16}/>} label="Mobile Number *"
                placeholder="+91 98765 43210" type="tel"
                onChange={(v) => setFormData({...formData, phone: v})}
                defaultValue={formData.phone}
              />
              <FastSelect
                icon={<User size={16}/>} label="Gender *"
                options={[{v:"male",l:"Male"},{v:"female",l:"Female"}]}
                onChange={(v) => setFormData({...formData, gender: v})}
              />
              <FastInput
                icon={<CreditCard size={16}/>} label="College / Employee ID"
                placeholder="e.g. SGGS-2022-CS-001" uppercase
                onChange={(v) => setFormData({...formData, collegeId: v})}
              />
              <FastInput
                icon={<Briefcase size={16}/>} label="Designation / Department"
                placeholder="e.g. HOD, Computer Science"
                onChange={(v) => setFormData({...formData, designation: v})}
              />
            </div>
          </div>

          {/* Emergency */}
          <div className="bg-white rounded-[1.75rem] p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-500"/> Emergency Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FastInput
                icon={<User size={16}/>} label="Guardian Name"
                placeholder="Parent / Spouse name"
                onChange={(v) => setFormData({...formData, guardianName: v})}
              />
              <FastInput
                icon={<Phone size={16}/>} label="Emergency Contact"
                placeholder="Emergency phone number"
                onChange={(v) => setFormData({...formData, emergencyPhone: v})}
              />
              <FastSelect
                icon={<HeartPulse size={16}/>} label="Blood Group"
                options={["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(v=>({v,l:v}))}
                onChange={(v) => setFormData({...formData, bloodGroup: v})}
              />
              <div className="sm:col-span-1"/>
              <div className="sm:col-span-2">
                <FastInput
                  icon={<MapPin size={16}/>} label="Permanent Address"
                  placeholder="House No, Street, City, State, PIN"
                  onChange={(v) => setFormData({...formData, address: v})}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-extrabold uppercase text-sm tracking-[0.15em] shadow-lg shadow-sky-500/25 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70">
            {isSubmitting ? <Loader2 size={19} className="animate-spin"/> : <><CheckCircle2 size={19}/> Save Profile</>}
          </button>
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Shared securely with Rector's Office only.
          </p>
        </form>
      </div>
    </div>
  );
}

function FastInput({ icon, label, placeholder, uppercase, onChange, type = "text", defaultValue = "" }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400">{React.cloneElement(icon, { size: 15 })}</div>
        <input type={type} placeholder={placeholder} defaultValue={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full py-3 pl-10 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder-slate-300 ${uppercase ? "uppercase" : ""}`} />
      </div>
    </div>
  );
}

function FastSelect({ icon, label, options, onChange }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">{React.cloneElement(icon, { size: 15 })}</div>
        <select defaultValue="" onChange={(e) => onChange(e.target.value)}
          className="w-full py-3 pl-10 pr-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer">
          <option value="" disabled>Select...</option>
          {options.map((opt) => <option key={opt.v} value={opt.v}>{opt.l}</option>)}
        </select>
      </div>
    </div>
  );
}