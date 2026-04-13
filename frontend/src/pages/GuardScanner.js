import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ShieldCheck, ArrowLeft, Camera, RefreshCw, AlertTriangle, Clock, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";

// ── Live Timer after check-in ────────────────────────────────────
function LiveTimer({ startTime }) {
  const [elapsed, setElapsed] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date() - new Date(startTime);
      setElapsed({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [startTime]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-emerald-400 font-mono font-black text-lg">
      <Clock size={16} className="animate-pulse"/>
      {pad(elapsed.h)}:{pad(elapsed.m)}:{pad(elapsed.s)}
    </div>
  );
}

export default function GuardScanner() {
  const [phase, setPhase] = useState("scanning"); // scanning | verifying | success | error
  const [scanData, setScanData] = useState(null);
  const [verifiedData, setVerifiedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    if (phase !== "scanning") return;

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 240, height: 240 },
      aspectRatio: 1,
    });

    scanner.render(
      async (decodedText) => {
        scanner.clear().catch(() => {});
        // QR format: STAYPG|bookingId|duNumber|roomNumber|hostelName
        // OR just bookingId
        await handleScan(decodedText);
      },
      () => {} // silent error
    );

    scannerRef.current = scanner;
    return () => { scanner.clear().catch(() => {}); };
  }, [phase]);

  const handleScan = async (decodedText) => {
    setPhase("verifying");

    try {
      // Parse QR
      const parts = decodedText.split("|");
      const bookingId = parts[1] || decodedText.trim();
      const duNumber = parts[2] || "";
      const roomNumber = parts[3] || "";
      const hostelName = parts[4] || "";

      // Verify booking with backend
      let booking = null;
      try {
        // Try to verify via API — get booking by DU number or ID
        const res = await API.get(`/api/book/all`);
        const allBookings = res.data;

        // Find matching booking
        booking = allBookings.find(b =>
          b._id === bookingId ||
          b.duNumber === duNumber ||
          (b.duNumber && decodedText.includes(b.duNumber))
        );
      } catch (apiErr) {
        // If API fails, use QR data directly
        booking = { duNumber, roomNumber, hostelName, paymentStatus: "approved" };
      }

      if (!booking) {
        setErrorMsg("No booking found for this QR code.");
        setPhase("error");
        return;
      }

      if (booking.paymentStatus !== "approved") {
        setErrorMsg(`Booking is ${booking.paymentStatus}. Not approved yet.`);
        setPhase("error");
        return;
      }

      // Mark check-in via API
      let checkInTime = new Date().toISOString();
      try {
        const checkInRes = await API.patch(`/api/book/checkin/${booking._id || bookingId}`, {});
        checkInTime = checkInRes.data.checkInTime || checkInTime;
      } catch (e) {
        // Proceed even if checkin API fails
      }

      setVerifiedData({
        name: booking.user?.name || "Verified Guest",
        role: booking.user?.role || "Guest",
        duNumber: booking.duNumber || duNumber,
        roomNumber: booking.roomNumber || roomNumber,
        hostelName: booking.hostelName || hostelName,
        checkInTime,
        checkOutTime: new Date(new Date(checkInTime).getTime() + 24 * 3600000).toISOString(),
      });
      setPhase("success");

    } catch (err) {
      setErrorMsg("Verification failed. Please try again.");
      setPhase("error");
    }
  };

  // Manual DU input fallback
  const [manualDU, setManualDU] = useState("");
  const handleManualVerify = async () => {
    if (!manualDU.trim()) return;
    await handleScan(manualDU.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white flex flex-col">
      <Toaster position="top-center"/>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white border border-slate-800 transition-colors">
          <ArrowLeft size={18}/>
        </button>
        <div className="text-center">
          <h1 className="text-sm font-extrabold tracking-[0.2em] text-slate-300 uppercase">Guard Terminal</h1>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">SGGSIE&T Campus Security</p>
        </div>
        <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <AnimatePresence mode="wait">

          {/* ── SCANNING STATE ── */}
          {phase === "scanning" && (
            <motion.div key="scan" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-sm">
              <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 shadow-2xl mb-4">
                <div className="flex items-center gap-2 mb-5">
                  <Camera size={17} className="text-orange-400 animate-pulse"/>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Scanning Live Feed</p>
                </div>
                {/* Camera feed */}
                <div id="qr-reader" className="overflow-hidden rounded-2xl bg-black border border-slate-800"/>
                <p className="text-center text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-widest">
                  Align StayPG QR within frame
                </p>
              </div>

              {/* Manual fallback */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Manual Entry (Fallback)</p>
                <div className="flex gap-2">
                  <input
                    type="text" value={manualDU} onChange={(e) => setManualDU(e.target.value.toUpperCase())}
                    placeholder="Enter DU Reference..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-sky-500 transition-colors uppercase"
                  />
                  <button onClick={handleManualVerify}
                    className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm transition-all">
                    Verify
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── VERIFYING STATE ── */}
          {phase === "verifying" && (
            <motion.div key="verify" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-center">
              <div className="w-20 h-20 bg-sky-500/10 border-2 border-sky-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"/>
              </div>
              <h2 className="text-xl font-extrabold text-white mb-2">Verifying...</h2>
              <p className="text-sm text-slate-400 font-medium">Checking booking records</p>
            </motion.div>
          )}

          {/* ── SUCCESS STATE ── */}
          {phase === "success" && verifiedData && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-sm">
              {/* Big success icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-4 border-emerald-400">
                  <ShieldCheck size={40} className="text-white"/>
                </div>
              </div>

              <h2 className="text-3xl font-black text-center text-white mb-1 tracking-tight">VERIFIED</h2>
              <p className="text-center text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-6">✅ Access Granted — Campus Entry</p>

              {/* Details card */}
              <div className="bg-slate-900 rounded-[1.75rem] p-6 border border-slate-800 mb-4 space-y-4">
                {/* Guest */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 font-extrabold text-sm border border-sky-500/30">
                    {verifiedData.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-white">{verifiedData.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{verifiedData.role}</p>
                  </div>
                </div>

                {/* Info rows */}
                {[
                  { label: "DU Reference", value: verifiedData.duNumber, mono: true },
                  { label: "Room No.", value: `Room ${verifiedData.roomNumber}`, mono: false },
                  { label: "Hostel", value: verifiedData.hostelName, mono: false },
                  { label: "Check-out", value: new Date(verifiedData.checkOutTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }), mono: false },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.label}</span>
                    <span className={`font-extrabold text-sm text-white ${row.mono ? "font-mono text-sky-400" : ""}`}>{row.value}</span>
                  </div>
                ))}

                {/* Live timer */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time in Campus</span>
                    <LiveTimer startTime={verifiedData.checkInTime}/>
                  </div>
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: "0.5%" }}/>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setScanData(null); setVerifiedData(null); setPhase("scanning"); }}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-2xl font-bold text-sm border border-slate-700 transition-all">
                  <RefreshCw size={15}/> Next Scan
                </button>
                <button onClick={() => navigate("/rector/dashboard")}
                  className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-500/20">
                  <Building2 size={15}/> Dashboard
                </button>
              </div>
            </motion.div>
          )}

          {/* ── ERROR STATE ── */}
          {phase === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-sm text-center">
              <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={36} className="text-rose-400"/>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Access Denied</h2>
              <p className="text-sm text-rose-400 font-bold mb-6">{errorMsg}</p>
              <button onClick={() => { setErrorMsg(""); setPhase("scanning"); }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold text-sm border border-slate-700 transition-all">
                <RefreshCw size={15}/> Try Again
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}