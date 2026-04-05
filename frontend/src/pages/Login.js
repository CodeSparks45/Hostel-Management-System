/**
 * Institutional Hostel Management System - Professional Login
 * Features: Automatic Redirection, LocalStorage Integration, StayPG UI
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";
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
  gradBtn: "linear-gradient(135deg,#FCD34D 0%,#FB923C 55%,#F97316 100%)",
  textDark: "#7C2D12",
  textMid: "rgba(120,53,15,0.72)",
  textMuted: "rgba(120,53,15,0.45)",
};

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter institutional email"),
  password: z.string().min(1, "Password is required"),
});

// ─── LEFT SIDE CHARACTER COMPONENT ──────────────────────────────────────────
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
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: C.textDark, margin: 0 }}>Grand Authority</h2>
        <p style={{ fontSize: 12, color: C.textMid, marginTop: 10, lineHeight: 1.6 }}>Precision in Management. <br/> <strong>Excellence in Hospitality.</strong></p>
      </div>
    </div>
  );
}

// ─── MAIN LOGIN PAGE ────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [welcomed, setWelcomed] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ 
    resolver: zodResolver(loginSchema) 
  });

  // Login Logic with Redirection
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", data);
      
      // Save Token and User Object (gender, role etc.)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); 

      toast.success("Identity Verified! Welcome to StayPG.");

      // REDIRECTION LOGIC

       setTimeout(() => {
      navigate("/"); 
    }, 1000);

  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid Credentials");
  } finally {
    setLoading(false);
  }
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 400 }}>
          
          <div style={{ textAlign: "center", marginBottom: 35 }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ display: "inline-flex", padding: 15, borderRadius: "30px", background: "#fff", marginBottom: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: `1px solid ${C.border}` }}>
              <img src={collegeLogo} alt="Logo" style={{ width: 85, height: 85, objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
            </motion.div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: C.textDark, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hostel Management</h1>
            <div style={{ height: 2, width: 40, background: C.primary, margin: "12px auto" }} />
          </div>

          <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 28, padding: "40px 30px", boxShadow: "0 30px 70px rgba(124,45,18,0.08)" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", marginBottom: 8, display: "block", marginLeft: 4 }}>Official Email</label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.primary, opacity: 0.5 }} size={16} />
                  <input {...register("email")} type="email" placeholder="user@sggs.ac.in" style={inputStyle} />
                </div>
                {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
              </div>
              
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", marginBottom: 8, display: "block", marginLeft: 4 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.primary, opacity: 0.5 }} size={16} />
                  <input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••" style={inputStyle} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={eyeBtnStyle}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
              </div>

              <div style={{ textAlign: "right", marginBottom: 25 }}>
                <Link to="/forgot-password" style={{ fontSize: 11, color: C.primary, fontWeight: 700, textDecoration: "none" }}>Forgot Password?</Link>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} style={submitBtnStyle}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Log In <LogIn size={18}/></>}
              </motion.button>
            </form>

            <div style={{ textAlign: "center", marginTop: 25, paddingTop: 20, borderTop: `1px solid rgba(124,45,18,0.08)` }}>
              <p style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>New User? <Link to="/signup" style={{ color: C.primary, fontWeight: 800, textDecoration: "none", marginLeft: 4 }}>Create Account</Link></p>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 10, color: C.textMuted, marginTop: 28, fontWeight: 700, letterSpacing: 1.5 }}>SGGSIE&T OFFICIAL PORTAL</p>
        </motion.div>
      </div>

      <style>{`
        @media(min-width:768px){.md-flex{display:flex!important}}
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Inline Styles for simplicity
const inputStyle = { width: "100%", padding: "14px 14px 14px 42px", background: C.fieldBg, border: `1px solid ${C.border}`, borderRadius: 14, fontSize: 14, outline: "none" };
const errorStyle = { fontSize: 11, color: "#DC2626", marginTop: 5, marginLeft: 4 };
const eyeBtnStyle = { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.primary, opacity: 0.5 };
const submitBtnStyle = { width: "100%", padding: "16px 0", borderRadius: 16, border: "none", background: C.gradBtn, color: "#7C2D12", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 };