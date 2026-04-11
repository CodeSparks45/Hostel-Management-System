import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UploadCloud, FileText, CheckCircle2, ShieldAlert,
  ArrowRight, Loader2, Clock, Building2, X, AlertCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

export default function VerifyPayment() {
  const location  = useLocation();
  const navigate  = useNavigate();

  const [duNumber, setDuNumber]         = useState("");
  const [file, setFile]                 = useState(null);
  const [fileObj, setFileObj]           = useState(null);
  const [status, setStatus]             = useState("idle");
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [uploadProgress, setUploadProgress]     = useState(0);

  // ── Pre-fill from SBCollect navigation state ──────────────────
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
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large! Max 5MB allowed.");
      return;
    }
    setFile(f.name);
    setFileObj(f);
    toast.success("Receipt attached! ✅");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!duNumber || !fileObj) {
      toast.error("DU Number aur Receipt dono zaroori hain.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    setStatus("submitting");

    try {
      // ── STEP 1: Receipt Cloudinary par upload karo ────────────
      // (Agar Cloudinary nahi hai toh receiptUrl empty string bhejo)
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
          console.warn("Cloud upload failed, proceeding without URL:", uploadErr.message);
          // Upload fail hone par bhi booking create karo — admin review karega
          toast("Receipt local note kar li — cloud upload retry baad mein.", { icon: "⚠️" });
        }
      }

      // ── STEP 2: MongoDB mein Booking create karo ─────────────
      const session   = JSON.parse(localStorage.getItem("lastPaymentSession") || "{}");
      const hostelId  = location.state?.hostelId || session.hostelId || "";
      const hostelName = location.state?.hostelName || session.hostelName || "Sahyadri";

      if (!hostelId) {
        // hostelId nahi mila — ye Explorer se aana chahiye tha
        toast.error("Room information missing. Please book again from Explorer.");
        setStatus("idle");
        return;
      }

      const response = await API.post("/api/book/", {
        roomId:     hostelId,    // MongoDB Room._id
        duNumber:   duNumber.toUpperCase().trim(),
        hostelName: hostelName,
        receiptUrl: receiptUrl,
      });

      const newBooking = response.data.booking;
      setSubmittedBooking(newBooking);
      setStatus("success");

      // Clean up session
      localStorage.removeItem("lastPaymentSession");

      toast.success("Request Rector ke paas pahunch gayi! ⏳");

    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);

      // Duplicate DU number case
      if (err?.response?.status === 400 && err?.response?.data?.booking) {
        setSubmittedBooking(err.response.data.booking);
        setStatus("success");
      } else {
        setStatus("idle");
      }
    }
  };

  // ── SUCCESS STATE ─────────────────────────────────────────────
  if (status === "success" && submittedBooking) {
    return (
      <div className="min-h-screen bg-sky-50/50 flex flex-col items-center justify-center p-6">
        <Toaster />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-amber-100 text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={48} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Awaiting Rector Approval</h2>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            Your request is now in the Rector's verification queue. You'll receive an email once approved.
          </p>

          {/* Details */}
          <div className="bg-sky-50 rounded-2xl p-5 text-left space-y-3 mb-8 border border-sky-100">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">DU Reference</span>
              <span className="font-black text-sky-600 font-mono">{submittedBooking.duNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Hostel</span>
              <span className="font-bold text-slate-800">{submittedBooking.hostelName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Status</span>
              <span className="px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                Pending Approval
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-500">Receipt</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={12} />
                {submittedBooking.receiptUrl ? "Uploaded ✅" : "Noted"}
              </span>
            </div>
          </div>

          {/* What next */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left mb-8 border border-slate-100">
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">What Happens Next</p>
            {[
              { n: 1, t: "Rector reviews DU number & receipt" },
              { n: 2, t: "Room allocated in Sahyadri / Nandgiri" },
              { n: 3, t: "Email with Check-in & Check-out details" },
              { n: 4, t: "QR Pass unlocked in My Bookings" },
            ].map(step => (
              <div key={step.n} className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <div className="w-5 h-5 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-black flex-shrink-0">{step.n}</div>
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
      </div>
    );
  }

  // ── MAIN FORM ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-sky-50/50 font-sans py-12 px-6">
      <Toaster />
      <div className="max-w-3xl mx-auto">

        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Claim Your Room Pass</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">
            Upload SBI Collect Receipt for Rector Verification
          </p>
        </div>

        {/* Auto-fill banner */}
        {location.state?.duNumber && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Payment Successful! DU Number pre-filled.</p>
              <p className="text-xs text-emerald-600 mt-0.5">Just upload your e-receipt to complete the process.</p>
            </div>
          </div>
        )}

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
                  type="text" required
                  placeholder="e.g. DU12345678"
                  value={duNumber}
                  onChange={(e) => setDuNumber(e.target.value.toUpperCase())}
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all text-slate-700 font-bold uppercase tracking-wide"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-2 ml-1">
                SBI e-Receipt mein "SBCollect Reference Number" naam se milega
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
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Tap to change</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={40} className="text-sky-400 mb-3" />
                    <p className="text-sm font-bold text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PDF, JPG, PNG — max 5MB</p>
                  </>
                )}
              </label>

              {/* Upload progress bar */}
              {status === "submitting" && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 font-bold mt-1 text-center">Uploading receipt... {uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting" || !duNumber || !fileObj}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-2xl font-bold uppercase text-sm tracking-[0.2em] shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? <><Loader2 className="animate-spin" size={20} /> Submitting to Rector's office...</>
                : <>Submit for Rector Verification <ArrowRight size={18} /></>
              }
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-slate-400 font-bold mt-6">
          Pehle se submit kar chuke ho?{" "}
          <button onClick={() => navigate("/my-bookings")} className="text-sky-500 hover:underline">
            My Bookings mein track karo →
          </button>
        </p>
      </div>
    </div>
  );
}