import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UploadCloud, FileText, CheckCircle2, ShieldAlert,
  ArrowRight, Loader2, Clock, Building2, AlertCircle,
  ArrowLeft
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";
import MobileNav from "./MobileNav";

export default function VerifyPayment() {
  const location  = useLocation();
  const navigate  = useNavigate();

  const [duNumber, setDuNumber]               = useState("");
  const [file, setFile]                       = useState(null);
  const [fileObj, setFileObj]                 = useState(null);
  const [status, setStatus]                   = useState("idle");
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [uploadProgress, setUploadProgress]   = useState(0);

  // Pre-fill DU number from navigation state or localStorage
  useEffect(() => {
    if (location.state?.duNumber) {
      setDuNumber(location.state.duNumber);
      toast.success("DU Number auto-filled! ✅");
    } else {
      const session = JSON.parse(localStorage.getItem("lastPaymentSession") || "{}");
      if (session?.duNumber) setDuNumber(session.duNumber);
    }
  }, [location.state]);

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("File too large! Max 5MB."); return; }
    setFile(f.name);
    setFileObj(f);
    toast.success("Receipt attached! ✅");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duNumber || !fileObj) { toast.error("DU Number aur Receipt dono zaroori hain."); return; }

    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first!"); navigate("/login"); return; }

    setStatus("submitting");

    try {
      // Step 1: Upload receipt
      let receiptUrl = "";
      if (fileObj) {
        const formDataObj = new FormData();
        formDataObj.append("image", fileObj);
        try {
          const uploadRes = await API.post("/api/upload-test", formDataObj, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            },
          });
          receiptUrl = uploadRes.data.fileUrl || "";
          toast.success("Receipt uploaded to cloud ☁️");
        } catch (uploadErr) {
          console.warn("Cloud upload failed:", uploadErr.message);
          toast("Receipt noted — cloud upload will retry.", { icon: "⚠️" });
        }
      }

      // Step 2: Create booking
      const session    = JSON.parse(localStorage.getItem("lastPaymentSession") || "{}");
      const hostelId   = location.state?.hostelId  || session.hostelId   || "";
      const hostelName = location.state?.hostelName || session.hostelName || "Sahyadri";
      const roomNumber = location.state?.roomNumber || session.roomNumber || ""; // ✅ ADDED THIS LINE

      if (!hostelId) {
        toast.error("Room information missing. Please book again from Explorer.");
        setStatus("idle");
        return;
      }

      const response = await API.post("/api/book/", {
        roomId:     hostelId,
        duNumber:   duNumber.toUpperCase().trim(),
        hostelName: hostelName,
        roomNumber: roomNumber, // ✅ ADDED THIS LINE
        receiptUrl: receiptUrl,
      });

      const newBooking = response.data.booking;
      setSubmittedBooking(newBooking);
      setStatus("success");
      localStorage.removeItem("lastPaymentSession");
      toast.success("Request Rector ke paas pahunch gayi! ⏳");

    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);

      if (err?.response?.status === 400 && err?.response?.data?.booking) {
        setSubmittedBooking(err.response.data.booking);
        setStatus("success");
      } else {
        setStatus("idle");
      }
    }
  };

  // ── SUCCESS STATE ──────────────────────────────────────────────
  if (status === "success" && submittedBooking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 pb-20 lg:pb-6">
        <Toaster />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-7 sm:p-10 rounded-[2.5rem] shadow-xl border border-amber-100 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock size={40} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">Awaiting Rector Approval</h2>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            Your request is now in the Rector's verification queue. You'll receive an email once approved.
          </p>

          {/* Details */}
          <div className="bg-sky-50 rounded-2xl p-5 text-left space-y-3 mb-7 border border-sky-100">
            {[
              { label: "DU Reference", value: submittedBooking.duNumber,   mono: true   },
              { label: "Hostel",       value: submittedBooking.hostelName, mono: false  },
              { label: "Status",       value: "Pending Approval",          badge: true  },
              { label: "Receipt",      value: submittedBooking.receiptUrl ? "Uploaded ✅" : "Noted", success: true },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">{row.label}</span>
                {row.badge
                  ? <span className="px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>
                  : row.success
                    ? <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={13} /> {row.value}</span>
                    : <span className={`font-extrabold text-slate-800 ${row.mono ? "font-mono text-sky-600 text-xs" : ""}`}>{row.value}</span>
                }
              </div>
            ))}
          </div>

          {/* Next steps */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left mb-7 border border-slate-100">
            <p className="text-xs font-extrabold text-slate-600 uppercase tracking-widest mb-3">What Happens Next</p>
            {[
              { n: 1, t: "Rector reviews DU number & receipt" },
              { n: 2, t: "Room allocated in Sahyadri / Krishna hostel" },
              { n: 3, t: "Email with Check-in & Check-out details" },
              { n: 4, t: "QR Pass unlocked in My Bookings" },
            ].map(step => (
              <div key={step.n} className="flex items-center gap-2 text-xs text-slate-500 mb-2 last:mb-0">
                <div className="w-5 h-5 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-extrabold flex-shrink-0">
                  {step.n}
                </div>
                {step.t}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              <Building2 size={16} /> Track in My Bookings
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
        <MobileNav />
      </div>
    );
  }

  // ── MAIN FORM ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 lg:pb-0">
      <Toaster />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 py-4 shadow-sm flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-slate-800 leading-none">Claim Your Room Pass</h1>
          <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-0.5">Upload SBI Collect Receipt</p>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        {/* Auto-fill banner */}
        {location.state?.duNumber && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-5 flex items-center gap-3">
            <CheckCircle2 size={19} className="text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Payment Successful! DU Number pre-filled.</p>
              <p className="text-xs text-emerald-600 mt-0.5">Just upload your e-receipt to complete the process.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2rem] p-5 sm:p-10 shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* DU Number */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-extrabold text-xs">1</span>
                SBI DU Reference Number
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="e.g. DU12345678"
                  value={duNumber}
                  onChange={e => setDuNumber(e.target.value.toUpperCase())}
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all text-slate-700 font-bold uppercase tracking-wide"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1">
                Found in your SBI e-Receipt as "SBCollect Reference Number"
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-extrabold text-xs">2</span>
                Upload Payment Receipt (PDF / Image)
              </label>
              <label className={`w-full flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${file ? "border-emerald-400 bg-emerald-50" : "border-sky-200 bg-sky-50/50 hover:bg-sky-50"}`}>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                />
                {file ? (
                  <>
                    <CheckCircle2 size={36} className="text-emerald-500 mb-3" />
                    <p className="text-sm font-bold text-emerald-700">{file}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Tap to change</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={36} className="text-sky-400 mb-3" />
                    <p className="text-sm font-bold text-slate-600">Click to upload or drag & drop</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PDF, JPG, PNG — max 5MB</p>
                  </>
                )}
              </label>

              {/* Upload progress bar */}
              {status === "submitting" && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-bold mt-1 text-center">Uploading receipt... {uploadProgress}%</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || !duNumber || !fileObj}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-[0.15em] shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? <><Loader2 className="animate-spin" size={20} /> Submitting to Rector's office...</>
                : <>Submit for Rector Verification <ArrowRight size={18} /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 font-bold mt-5">
          Already submitted?{" "}
          <button
            onClick={() => navigate("/my-bookings")}
            className="text-sky-500 hover:underline font-extrabold"
          >
            Track in My Bookings →
          </button>
        </p>
      </div>

      <MobileNav />
    </div>
  );
}