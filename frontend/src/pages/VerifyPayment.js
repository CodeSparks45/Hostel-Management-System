import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UploadCloud, FileText, CheckCircle2, ShieldAlert,
  ArrowRight, Loader2, Clock, Building2, QrCode
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const [duNumber, setDuNumber] = useState("");
  const [file, setFile] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [submittedData, setSubmittedData] = useState(null);

  // ✅ Pre-fill DU number if coming from SBCollect
  useEffect(() => {
    if (location.state?.duNumber) {
      setDuNumber(location.state.duNumber);
      toast.success("DU Number auto-filled from your payment!");
    } else {
      // Also try localStorage session
      const session = JSON.parse(localStorage.getItem("lastPaymentSession"));
      if (session?.duNumber) {
        setDuNumber(session.duNumber);
      }
    }
  }, [location.state]);

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      const f = e.target.files[0];
      if (f.size > 5 * 1024 * 1024) {
        toast.error("File too large! Max 5MB allowed.");
        return;
      }
      setFile(f.name);
      setFileObj(f);
      toast.success("Receipt attached! ✅");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!duNumber || !file) {
      toast.error("Please provide both DU Number and Receipt.");
      return;
    }

    setStatus("submitting");

    setTimeout(() => {
      // ✅ Build the pending request object
      const session = JSON.parse(localStorage.getItem("lastPaymentSession")) || {};
      const user = JSON.parse(localStorage.getItem("user")) || {};

      const newRequest = {
        id: duNumber,
        name: location.state?.name || session.name || user.name || "Guest Visitor",
        designation: session.designation || user.designation || "Institutional Guest",
        date: new Date().toLocaleString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit"
        }),
        receipt: file,
        amount: location.state?.amount || session.amount || "450",
        hostelId: location.state?.hostelId || session.hostelId || "sahyadri-elite",
        purpose: session.purpose || "Official Visit",
        mobile: session.mobile || "",
        status: "pending",
        submittedAt: Date.now(),
      };

      // ✅ Add to pendingRequests in localStorage (Rector reads this)
      const existing = JSON.parse(localStorage.getItem("pendingRequests")) || [];
      // Avoid duplicate DU numbers
      const filtered = existing.filter(r => r.id !== duNumber);
      const updated = [newRequest, ...filtered];
      localStorage.setItem("pendingRequests", JSON.stringify(updated));

      // ✅ Also save to myBookings for MyBookings page
      const myBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
      const bookingEntry = {
        ...newRequest,
        bookingStatus: "pending", // pending | approved | rejected
        createdAt: new Date().toISOString(),
      };
      const filteredBookings = myBookings.filter(b => b.id !== duNumber);
      localStorage.setItem("myBookings", JSON.stringify([bookingEntry, ...filteredBookings]));

      setSubmittedData(newRequest);
      setStatus("success");
      toast.success("Submitted to Rector's office! 🎯");
    }, 2000);
  };

  // ─── SUCCESS SCREEN ───
  if (status === "success" && submittedData) {
    return (
      <div className="min-h-screen bg-sky-50/50 flex flex-col items-center justify-center p-6">
        <Toaster />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-amber-100 text-center max-w-md w-full"
        >
          {/* Pending Icon */}
          <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={48} />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Awaiting Rector Approval</h2>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            Your request has been submitted to the Rector's office. You will receive confirmation once approved.
          </p>

          {/* Details Card */}
          <div className="bg-sky-50 rounded-2xl p-5 text-left space-y-3 mb-8 border border-sky-100">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">DU Reference</span>
              <span className="font-black text-sky-600 font-mono">{submittedData.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Name</span>
              <span className="font-bold text-slate-800">{submittedData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Amount Paid</span>
              <span className="font-bold text-slate-800">₹{submittedData.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Receipt</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Uploaded
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Status</span>
              <span className="px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                Pending Approval
              </span>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left mb-8 border border-slate-100">
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">What Happens Next</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black flex-shrink-0">1</div>
                Rector reviews your DU number & receipt
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-5 h-5 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-black flex-shrink-0">2</div>
                Room is allocated in Sahyadri / Nandgiri Hostel
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black flex-shrink-0">3</div>
                You receive email with Check-in / Check-out details
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-black flex-shrink-0">4</div>
                QR Pass becomes available in "Verify Pass" section
              </div>
            </div>
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
      </div>
    );
  }

  // ─── MAIN FORM ───
  return (
    <div className="min-h-screen bg-sky-50/50 font-sans py-12 px-6">
      <Toaster />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Claim Your Room Pass</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Upload SBI Collect Receipt for Rector Verification</p>
        </div>

        {/* Info Banner if coming from payment */}
        {location.state?.duNumber && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Payment Successful! DU Number pre-filled.</p>
              <p className="text-xs text-emerald-600 mt-0.5">Just upload your e-receipt to complete the process.</p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-sky-100 border border-sky-100">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* DU Number */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-black">1</span>
                SBI DU Reference Number
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  required
                  placeholder="e.g. DU12345678"
                  value={duNumber}
                  onChange={(e) => setDuNumber(e.target.value.toUpperCase())}
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all text-slate-700 font-bold uppercase tracking-wide"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1">
                Find this on your SBI e-Receipt as "SBCollect Reference Number"
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-black">2</span>
                Upload Payment Receipt (PDF / Image)
              </label>
              <label className={`w-full flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${file ? "border-emerald-400 bg-emerald-50" : "border-sky-200 bg-sky-50/50 hover:bg-sky-50"}`}>
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
                {file ? (
                  <>
                    <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
                    <p className="text-sm font-bold text-emerald-700">{file}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Tap to change file</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={40} className="text-sky-400 mb-3" />
                    <p className="text-sm font-bold text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PDF, JPG, PNG up to 5MB</p>
                  </>
                )}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting" || !duNumber || !file}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-2xl font-bold uppercase text-sm tracking-[0.2em] shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? <><Loader2 className="animate-spin" size={20} /> Submitting to Rector...</>
                : <>Submit for Rector Verification <ArrowRight size={18} /></>
              }
            </button>
          </form>
        </div>

        {/* Already submitted? */}
        <p className="text-center text-xs text-slate-400 font-bold mt-6">
          Already submitted?{" "}
          <button onClick={() => navigate("/my-bookings")} className="text-sky-500 hover:underline">
            Track in My Bookings →
          </button>
        </p>
      </div>
    </div>
  );
}