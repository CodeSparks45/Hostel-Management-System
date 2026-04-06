import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyPayment() {
  const [duNumber, setDuNumber] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, submitting, success

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0].name);
      toast.success("Receipt attached!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!duNumber || !file) {
      toast.error("Please provide both DU Number and Receipt.");
      return;
    }
    
    setStatus("submitting");
    
    // Simulate Backend API Call
    setTimeout(() => {
      setStatus("success");
      // Here you would update the database so the Rector sees this as "Pending"
    }, 2000);
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-sky-50/50 flex flex-col items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-emerald-100 text-center max-w-md">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Verification Pending</h2>
          <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
            Your DU Reference <span className="font-bold text-slate-800">{duNumber}</span> and receipt have been securely sent to the Rector's office. You will receive your Smart Gate Pass once approved.
          </p>
          <button onClick={() => window.location.href = '/dashboard'} className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg">
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50/50 font-sans py-12 px-6">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Claim Your Smart Pass</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Upload SBI Collect Receipt for Verification</p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-sky-100 border border-sky-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: DU Number */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">1</span> 
                SBI DU Reference Number
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" required placeholder="e.g. DUJ12345678" 
                  value={duNumber} onChange={(e) => setDuNumber(e.target.value.toUpperCase())}
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all text-slate-700 font-bold uppercase tracking-wide"
                />
              </div>
            </div>

            {/* Step 2: File Upload */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                <span className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">2</span> 
                Upload Payment Receipt (PDF/Image)
              </label>
              <label className={`w-full flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${file ? 'border-emerald-400 bg-emerald-50' : 'border-sky-200 bg-sky-50/50 hover:bg-sky-50'}`}>
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

            {/* Submit Button */}
            <button 
              type="submit" disabled={status === "submitting"}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-2xl font-bold uppercase text-sm tracking-[0.2em] shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 disabled:opacity-70"
            >
              {status === "submitting" ? <Loader2 className="animate-spin" size={20} /> : <>Submit for Verification <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}