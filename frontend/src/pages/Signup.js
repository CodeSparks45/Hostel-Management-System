/**
 * Institutional Hostel Management System - Signup Portal
 * Features: Role & Gender Selection for StayPG Logic
 * Fix: VenusAndMars icon update for lucide-react compatibility
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle, 
  Loader2, User, UserPlus, ShieldCheck, 
  Briefcase, VenusAndMars 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

import collegeLogo from "./sggs-logo.png"; 

const C = {
  pageBg: "#FFF8F0",
  leftBg: "linear-gradient(155deg,#FEF9F0 0%,#FFF0DC 50%,#FFF5E8 100%)",
  cardBg: "rgba(255,255,255,0.95)",
  fieldBg: "rgba(255,248,240,0.85)",
  border: "rgba(251,146,60,0.25)",
  borderFocus: "rgba(249,115,22,0.6)",
  primary: "#F97316",
  primaryDark: "#EA580C",
  gradBtn: "linear-gradient(135deg,#FCD34D 0%,#FB923C 55%,#F97316 100%)",
  textDark: "#7C2D12",
  textMid: "rgba(120,53,15,0.72)",
  textMuted: "rgba(120,53,15,0.45)",
  errorText: "#DC2626",
};

const signupSchema = z.object({
  name: z.string().min(1, "Full Name is required").max(50),
  email: z.string().min(1, "Email is required").email("Enter institutional email"),
  password: z.string().min(8, "Security protocol requires 8+ characters"),
  role: z.enum(["professor", "hod", "principal", "guest"], {
    errorMap: () => ({ message: "Please select your designation" }),
  }),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required for hostel allocation" }),
  }),
});

function Character({ welcomed }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ position: "relative", width: 280, height: 280 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: -15, borderRadius: "50%", border: `1px dashed ${C.primary}`, opacity: 0.15 }} />
        <motion.div animate={{ scale: welcomed ? [1, 1.1, 1] : 1, opacity: welcomed ? [0.3, 0.5, 0.3] : 0.1 }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${C.primary} 0%, transparent 70%)` }} />
        <svg viewBox="0 0 240 240" style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}>
          <ellipse cx="120" cy="220" rx="45" ry="8" fill="rgba(124,45,18,0.08)" />
          <motion.g animate={{ y: welcomed ? -10 : 0 }} transition={{ type: "spring", stiffness: 100 }}>
            <path d="M65 215 L80 155 Q120 130 160 155 L175 215 Z" fill="white" stroke={C.primary} strokeWidth="2" />
            <path d="M108 153 L120 172 L132 153" fill="white" stroke={C.primary} strokeWidth="1.5" />
            <path d="M116 172 L124 172 L120 195 Z" fill={C.primary} />
            <circle cx="120" cy="115" r="26" fill="#FFFBEB" stroke={C.primary} strokeWidth="2" />
            <g opacity="0.6" stroke={C.textDark} strokeWidth="1.2" fill="none">
              <path d="M106 115 Q112 110 118 115" />
              <path d="M122 115 Q128 110 134 115" />
              <line x1="118" y1="115" x2="122" y2="115" />
            </g>
          </motion.g>
        </svg>
      </div>
      <div style={{ textAlign: "center", maxWidth: 300 }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: C.textDark, margin: 0 }}>
          StayPG <span style={{ color: C.primary }}>Portal</span>
        </h2>
        <p style={{ fontSize: 12, color: C.textMid, marginTop: 10, lineHeight: 1.6, opacity: 0.8 }}>
          Precision in Management. <br/> 
          <strong>Excellence in Hospitality.</strong>
        </p>
      </div>
    </div>
  );
}

function Field({ id, label, icon: Icon, error, rightEl, children, isSelect, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted, marginBottom: 6, marginLeft: 4 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: error ? C.errorText : "rgba(180,80,20,0.4)", zIndex: 5 }}>
          <Icon size={16} />
        </span>
        {isSelect ? (
          <select {...props} style={{ width: "100%", padding: "12px 14px 12px 42px", background: C.fieldBg, border: `1px solid ${error ? "#FDA4AF" : C.border}`, borderRadius: 14, fontSize: 13.5, outline: "none", appearance: "none", cursor: "pointer" }}>
            {children}
          </select>
        ) : (
          <input {...props} style={{ width: "100%", padding: "12px 14px 12px 42px", background: C.fieldBg, border: `1px solid ${error ? "#FDA4AF" : C.border}`, borderRadius: 14, fontSize: 13.5, outline: "none" }} onFocus={(e) => e.target.style.borderColor = C.borderFocus} />
        )}
        {rightEl && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>{rightEl}</div>}
      </div>
      {error && <p style={{ fontSize: 11, color: C.errorText, marginTop: 5, marginLeft: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12}/>{error}</p>}
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [welcomed, setWelcomed] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post("/api/auth/signup", data);
      toast.success("Registration Successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.pageBg, fontFamily: "'Inter', sans-serif" }}>
      <Toaster position="top-right" />

      {/* LEFT SIDE VISUAL */}
      <motion.div onMouseEnter={() => setWelcomed(true)} onMouseLeave={() => setWelcomed(false)} style={{ display: "none", width: "45%", background: C.leftBg, borderRight: `1px solid ${C.border}`, flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }} className="md-flex">
        <Character welcomed={welcomed} />
      </motion.div>

      {/* RIGHT SIDE FORM */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 450 }}>
          
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ display: "inline-flex", padding: 12, borderRadius: "28px", background: "#fff", marginBottom: 15, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
              <img src={collegeLogo} alt="College Logo" style={{ width: 75, height: 75, objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; }} />
            </motion.div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: C.textDark, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hostel Management</h1>
            <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, letterSpacing: 1.2 }}>SECURE ENROLLMENT GATEWAY</p>
          </div>

          <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 28, padding: "35px 30px", boxShadow: "0 30px 70px rgba(124,45,18,0.08)" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Field id="name" label="Full Name" icon={User} type="text" placeholder="Prof. Abhijit Singh" error={errors.name?.message} {...register("name")} />
              
              <Field id="email" label="Official Email" icon={Mail} type="email" placeholder="user@sggs.ac.in" error={errors.email?.message} {...register("email")} />
              
              {/* DESIGNATION DROPDOWN */}
              <Field id="role" label="Designation" icon={Briefcase} isSelect error={errors.role?.message} {...register("role")}>
                <option value="">Select Professional Role</option>
                <option value="professor">Faculty / Professor</option>
                <option value="hod">Department Head (HOD)</option>
                <option value="principal">Principal / Director</option>
                <option value="guest">Visiting Guest</option>
              </Field>

              {/* GENDER DROPDOWN (STAYPG CORE LOGIC) */}
              <Field id="gender" label="Gender Allocation" icon={VenusAndMars} isSelect error={errors.gender?.message} {...register("gender")}>
                <option value="">Select Gender</option>
                <option value="male">Male (Sahyadri Hostel)</option>
                <option value="female">Female (Nandgiri Hostel)</option>
              </Field>

              <Field id="password" label="Security Password" icon={Lock} type={showPw ? "text" : "password"} placeholder="••••••••" error={errors.password?.message} {...register("password")}
                rightEl={<button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(180,80,20,0.4)" }}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              />

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
                style={{ width: "100%", padding: "16px 0", marginTop: 10, borderRadius: 16, border: "none", background: C.gradBtn, color: "#7C2D12", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Complete Signup <UserPlus size={18}/></>}
              </motion.button>
            </form>
            
            <div style={{ textAlign: "center", marginTop: 22 }}>
              <p style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>
                Already registered? <Link to="/login" style={{ color: C.primary, fontWeight: 800, textDecoration: "none", marginLeft: 4 }}>Log In</Link>
              </p>
            </div>
          </div>

          <div style={{ marginTop: 25, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: C.textMuted }}>
             <ShieldCheck size={14} color={C.primary} />
             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2 }}>SGGSIE&T OFFICIAL PORTAL</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media(min-width:768px){.md-flex{display:flex!important}}
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}