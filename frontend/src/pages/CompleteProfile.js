import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, User, MapPin, ShieldAlert, ArrowRight, Loader2, BookOpen,
  CheckCircle2, Edit3, GraduationCap, Building2, Calendar, Briefcase,
  IdCard, UserCheck, AlertCircle
} from "lucide-react";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import SggsLogo from "./sggs-logo.png";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [savedUser, setSavedUser] = useState(null);
  
  // Dynamic form state including role
  const [formData, setFormData] = useState({
    role: "student", // default role: 'student', 'staff', 'guest'
    phone: "", 
    emergencyPhone: "", 
    address: "",
    // Student specific
    collegeId: "", course: "", year: "", guardianName: "",
    // Staff specific
    employeeId: "", department: "",
    // Guest specific
    idProof: "", purpose: ""
  });

  // Load existing profile if available
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    // Check if user has basic required fields saved
    if (stored && stored.phone) {
      setSavedUser(stored);
      setProfileSaved(true);
      // Pre-fill form for edit mode
      setFormData(prev => ({ ...prev, ...stored, role: stored.role || "student" }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Clean up payload based on role to avoid sending empty irrelevant fields
      const payload = { ...formData };
      if (payload.role !== 'student') {
        delete payload.collegeId; delete payload.course; delete payload.year; delete payload.guardianName;
      }
      if (payload.role !== 'staff') {
        delete payload.employeeId; delete payload.department;
      }
      if (payload.role !== 'guest') {
        delete payload.idProof; delete payload.purpose;
      }

      const res = await API.put("/api/auth/complete-profile", payload);
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

  // ─── PROFILE VIEW (MODERN DIGITAL ID CARD STYLE) ────────────────────────
  if (profileSaved && savedUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
        <Toaster position="top-right" />

        {/* Premium Header */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={SggsLogo} alt="SGGS Logo" className="w-10 object-contain drop-shadow-sm" />
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-none tracking-tight">StayPG</p>
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] mt-1">Identity</p>
              </div>
            </div>
            <button onClick={() => setProfileSaved(false)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm font-bold text-slate-700 shadow-sm transition-all active:scale-95">
              <Edit3 size={16} className="text-sky-500" /> Edit
            </button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Digital ID Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-900 rounded-[2rem] p-8 mb-8 overflow-hidden shadow-2xl shadow-slate-900/20">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-teal-400 rounded-[1.5rem] p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-4xl font-extrabold text-white">
                  {savedUser.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{savedUser.name}</h2>
                  <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-sky-500/30">
                    {savedUser.role || "Student"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                  <MapPin size={14} /> SGGSIE&T, Vishnupuri, Nanded
                </p>
              </div>

              {/* Dynamic Primary ID display based on role */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl text-right w-full sm:w-auto">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                  {savedUser.role === 'staff' ? 'Employee ID' : savedUser.role === 'guest' ? 'ID Proof' : 'College ID'}
                </p>
                <p className="text-lg font-mono font-bold text-white">
                  {savedUser.collegeId || savedUser.employeeId || savedUser.idProof || "—"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-[1.5rem] border border-slate-200/60 p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-6">
                <Briefcase size={18} className="text-sky-500" /> Role Specific Details
              </h3>
              <div className="space-y-5">
                {savedUser.role === 'student' && (
                  <>
                    <ProfileRow icon={<GraduationCap />} label="Course" value={savedUser.course} />
                    <ProfileRow icon={<Calendar />} label="Year" value={savedUser.year} />
                  </>
                )}
                {savedUser.role === 'staff' && (
                  <ProfileRow icon={<Building2 />} label="Department" value={savedUser.department} />
                )}
                {savedUser.role === 'guest' && (
                  <ProfileRow icon={<UserCheck />} label="Purpose of Visit" value={savedUser.purpose} />
                )}
                <ProfileRow icon={<Phone />} label="Personal Mobile" value={savedUser.phone} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-[1.5rem] border border-slate-200/60 p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-6">
                <ShieldAlert size={18} className="text-rose-500" /> Emergency & Address
              </h3>
              <div className="space-y-5">
                {savedUser.role === 'student' && (
                  <ProfileRow icon={<User />} label="Guardian" value={savedUser.guardianName} />
                )}
                <ProfileRow icon={<Phone />} label="Emergency Contact" value={savedUser.emergencyPhone} />
                <ProfileRow icon={<MapPin />} label="Permanent Address" value={savedUser.address} />
              </div>
            </motion.div>
          </div>

          {/* Quick Actions Navigation */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => navigate("/dashboard")}
              className="flex items-center justify-between bg-white hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-bold border border-slate-200/60 shadow-sm transition-all group">
              <span className="flex items-center gap-3"><Building2 className="text-sky-500" size={20} /> Access Dashboard</span>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
            </button>
            <button onClick={() => navigate("/my-bookings")}
              className="flex items-center justify-between bg-white hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-bold border border-slate-200/60 shadow-sm transition-all group">
              <span className="flex items-center gap-3"><CheckCircle2 className="text-teal-500" size={20} /> My Bookings</span>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── DYNAMIC FORM VIEW ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
      <Toaster position="top-right" />

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <img src={SggsLogo} alt="SGGS Logo" className="w-9 object-contain drop-shadow-sm" />
          <div>
            <p className="text-base font-extrabold text-slate-900 leading-none">Setup Profile</p>
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-1">StayPG Booking System</p>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
          
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            
            {/* Role Selection Segment Control */}
            <div>
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 block">
                I am a...
              </label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                {['student', 'staff', 'guest'].map((roleType) => (
                  <button key={roleType} type="button"
                    onClick={() => setFormData({ ...formData, role: roleType })}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg capitalize transition-all duration-300 ${
                      formData.role === roleType 
                        ? 'bg-white text-sky-600 shadow-sm border border-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    {roleType}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Fields Section */}
            <motion.div layout className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <IdCard size={20} className="text-sky-500" /> Identity Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {/* STUDENT FIELDS */}
                  {formData.role === 'student' && (
                    <motion.div key="student-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="contents">
                      <InputField icon={<IdCard />} label="Registration / College ID" placeholder="e.g. 2022BTECS000" uppercase
                        value={formData.collegeId} onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })} />
                      <SelectField icon={<GraduationCap />} label="Course" value={formData.course}
                        options={["B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year", "M.Tech", "Ph.D"]}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })} />
                      <InputField icon={<User />} label="Guardian Name" placeholder="Parent/Guardian Full Name"
                        value={formData.guardianName} onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} />
                    </motion.div>
                  )}

                  {/* STAFF FIELDS */}
                  {formData.role === 'staff' && (
                    <motion.div key="staff-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="contents">
                      <InputField icon={<IdCard />} label="Employee ID" placeholder="e.g. EMP12345" uppercase
                        value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} />
                      <InputField icon={<Building2 />} label="Department" placeholder="e.g. Computer Science"
                        value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                    </motion.div>
                  )}

                  {/* GUEST FIELDS */}
                  {formData.role === 'guest' && (
                    <motion.div key="guest-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="contents">
                      <InputField icon={<IdCard />} label="ID Proof Number (Aadhar/PAN)" placeholder="Enter ID Number" uppercase
                        value={formData.idProof} onChange={(e) => setFormData({ ...formData, idProof: e.target.value })} />
                      <InputField icon={<UserCheck />} label="Purpose of Visit" placeholder="e.g. Guest Lecture, Exam Duty"
                        value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* COMMON FIELDS */}
                <InputField icon={<Phone />} label="Your Mobile Number" placeholder="+91 98765 43210"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </motion.div>

            {/* Contact & Emergency Section */}
            <motion.div layout>
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-5 mt-4">
                <AlertCircle size={20} className="text-rose-500" /> Contact & Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField icon={<Phone />} label="Emergency Contact Phone" placeholder="For emergencies only"
                  value={formData.emergencyPhone} onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })} />
                <div className="md:col-span-2">
                  <InputField icon={<MapPin />} label="Permanent Residential Address" placeholder="House No, Street, City, State, PIN"
                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </motion.div>

            <button type="submit" disabled={isSubmitting}
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white py-[1.2rem] rounded-2xl font-extrabold uppercase text-sm tracking-[0.15em] shadow-xl shadow-slate-900/20 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-70">
              {isSubmitting ? <Loader2 size={20} className="animate-spin text-sky-400" /> : <>Save & Continue <ArrowRight size={18} className="text-sky-400" /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-50 transition-colors flex-shrink-0">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function InputField({ icon, label, placeholder, uppercase, value, onChange }) {
  return (
    <div>
      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2 block ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <input required type="text" placeholder={placeholder} value={value} onChange={onChange}
          className={`w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium ${uppercase ? "uppercase" : ""}`} />
      </div>
    </div>
  );
}

function SelectField({ icon, label, options, value, onChange }) {
  return (
    <div>
      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2 block ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors pointer-events-none">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <select required value={value || ""} onChange={onChange}
          className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-bold text-slate-800 appearance-none cursor-pointer">
          <option value="" disabled>Select Option</option>
          {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );
}