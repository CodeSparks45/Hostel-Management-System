import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Download, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SBCollectSimulator() {
  const { id, amount } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [state, setState] = useState("");
  const [instType, setInstType] = useState("");
  const [instName, setInstName] = useState("");
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    mobile: "",
    dob: "",
    purpose: "",
  });
  const [duNumber, setDuNumber] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Processing transaction via Secure Bank Gateway...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      const randomDU = "DU" + Math.floor(10000000 + Math.random() * 90000000);
      setDuNumber(randomDU);

      // ✅ Save payment session to localStorage so VerifyPayment can pre-fill
      const paymentSession = {
        duNumber: randomDU,
        name: formData.name,
        designation: formData.designation,
        mobile: formData.mobile,
        amount: amount || "450",
        hostelId: id,
        category,
        timestamp: new Date().toLocaleString(),
        status: "payment_done_pending_verification",
      };
      localStorage.setItem("lastPaymentSession", JSON.stringify(paymentSession));

      setStep(4);
      toast.success("Transaction Successful! ✅");
    }, 2500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleProceedToVerify = () => {
    // ✅ Navigate to VerifyPayment with DU number pre-filled via state
    navigate("/verify-payment", {
      state: {
        duNumber: duNumber,
        name: formData.name,
        amount: amount || "450",
        hostelId: id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-[#333]">
      <Toaster />

      {/* ── SBI HEADER ── */}
      <div className="bg-white border-b-4 border-[#0f4a8a] py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f4a8a] rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">
            SBI
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0f4a8a] uppercase tracking-wide">State Bank Collect</h1>
            <p className="text-[10px] text-gray-500">Multimodal Payment Portal</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 font-bold hidden sm:block">
          <span className="text-[#0f4a8a]">English</span> | Hindi
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="flex items-center gap-2">
            {["Terms", "State & Type", "Institution", "Payment Details"].map((label, i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center gap-1 text-xs font-bold ${step >= i ? "text-[#0f4a8a]" : "text-gray-400"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${step >= i ? "bg-[#0f4a8a] text-white border-[#0f4a8a]" : "border-gray-300 text-gray-400"}`}>
                    {i + 1}
                  </div>
                  <span className="hidden sm:block">{label}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 ${step > i ? "bg-[#0f4a8a]" : "bg-gray-200"}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTAINER ── */}
      <div className="max-w-4xl mx-auto mt-6 bg-white border border-gray-300 shadow-md mb-10">
        <div className="bg-[#0f4a8a] text-white px-4 py-2 text-sm font-bold">
          STATE BANK COLLECT
        </div>

        <div className="p-6">

          {/* STEP 0: TERMS */}
          {step === 0 && (
            <div>
              <h2 className="text-[#0f4a8a] text-lg font-bold border-b border-gray-200 pb-2 mb-4">Terms Used</h2>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5 mb-6">
                <li>Corporate Customer: Firm/Company/Institution (F/C/I) collecting payment from their beneficiaries.</li>
                <li>User: The beneficiary making a payment to F/C/I for the services/goods availed.</li>
                <li>Bank shall not be responsible, in any way, for the quality or merchantability of any product/merchandise or any of the services related thereto, whatsoever, offered to the User by the Corporate Customer.</li>
                <li>This is a simulated SBI Collect portal for institutional testing purposes at SGGSIE&T.</li>
              </ul>
              <div className="bg-[#f9f9f9] border border-gray-200 p-4 mb-6 text-sm flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 cursor-pointer w-4 h-4"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="cursor-pointer text-red-600 font-bold">
                  I have read and accepted the terms and conditions stated above.
                  <br /><span className="text-gray-500 font-normal">(Click Check Box to proceed for payment.)</span>
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  disabled={!termsAccepted}
                  onClick={() => setStep(1)}
                  className="bg-[#0f4a8a] text-white px-8 py-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0c396b] transition-colors"
                >
                  Proceed
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: STATE & TYPE */}
          {step === 1 && (
            <div>
              <h2 className="text-[#0f4a8a] text-lg font-bold border-b border-gray-200 pb-2 mb-6">
                Select State and Type of Corporate / Institution
              </h2>
              <div className="max-w-md mx-auto space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-700">State of Corporate / Institution <span className="text-red-500">*</span></label>
                  <select className="border border-gray-400 p-1.5 text-sm w-full sm:w-48 bg-white" value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="">--Select State--</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-700">Type of Corporate / Institution <span className="text-red-500">*</span></label>
                  <select className="border border-gray-400 p-1.5 text-sm w-full sm:w-48 bg-white" value={instType} onChange={(e) => setInstType(e.target.value)}>
                    <option value="">--Select Type--</option>
                    <option value="Educational Institutions">Educational Institutions</option>
                    <option value="Govt Department">Govt Department</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => setStep(0)} className="bg-gray-200 border border-gray-400 text-gray-800 px-6 py-1.5 font-bold hover:bg-gray-300">Back</button>
                <button disabled={!state || !instType} onClick={() => setStep(2)} className="bg-[#0f4a8a] text-white px-6 py-1.5 font-bold disabled:opacity-50 hover:bg-[#0c396b]">Go</button>
              </div>
            </div>
          )}

          {/* STEP 2: INSTITUTION NAME */}
          {step === 2 && (
            <div>
              <h2 className="text-[#0f4a8a] text-lg font-bold border-b border-gray-200 pb-2 mb-6">
                Select from Educational Institutions
              </h2>
              <div className="max-w-xl mx-auto space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-700">Educational Institutions Name <span className="text-red-500">*</span></label>
                  <select className="border border-gray-400 p-1.5 text-sm w-full sm:w-64 bg-white" value={instName} onChange={(e) => setInstName(e.target.value)}>
                    <option value="">--Select Institution--</option>
                    <option value="SGGSIE&T">SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGG & TECH</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => setStep(1)} className="bg-gray-200 border border-gray-400 text-gray-800 px-6 py-1.5 font-bold hover:bg-gray-300">Back</button>
                <button disabled={!instName} onClick={() => setStep(3)} className="bg-[#0f4a8a] text-white px-6 py-1.5 font-bold disabled:opacity-50 hover:bg-[#0c396b]">Submit</button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT FORM */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-[#0f4a8a] flex items-center justify-center text-white font-black text-xs text-center rounded">
                  SGGS<br/>IE&T
                </div>
                <div>
                  <h2 className="text-[#0f4a8a] text-lg font-bold">SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGG & TECH</h2>
                  <p className="text-xs text-gray-600">VISHNUPURI, NANDED, MAHARASHTRA-431606</p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="max-w-2xl mx-auto border border-gray-300 mb-8">
                <div className="bg-[#f0f0f0] px-4 py-2 border-b border-gray-300">
                  <p className="text-sm font-bold text-[#0f4a8a]">Provide details of payment</p>
                </div>
                <div className="p-4 space-y-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="sm:w-1/3 font-bold text-gray-700">Select Payment Category <span className="text-red-500">*</span></label>
                    <select required value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-400 p-1.5 w-full sm:w-2/3">
                      <option value="">--Select Category--</option>
                      <option value="Guest Room Charges">Guest Room Charges</option>
                      <option value="Faculty Accommodation">Faculty Accommodation</option>
                      <option value="Conference / Event Stay">Conference / Event Stay</option>
                    </select>
                  </div>

                  {category && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="Dr. / Prof. / Mr. / Ms." className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Designation / Department <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="e.g. HOD, Computer Science / AICTE Inspector" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Purpose of Visit <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="e.g. Board Meeting / Annual Inspection" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Amount <span className="text-red-500">*</span></label>
                        <input readOnly type="text" className="border border-gray-400 p-1.5 w-full sm:w-2/3 bg-gray-100 font-bold" value={`₹${amount || "450"} per day`} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Remarks</label>
                        <textarea className="border border-gray-400 p-1.5 w-full sm:w-2/3" rows={2} placeholder={`Hostel Block: ${id || 'Sahyadri Elite'}`}></textarea>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs text-gray-700 mt-2">
                        ⚠️ Please enter your Mobile Number and Date of Birth. This is required to reprint your e-receipt if needed.
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                        <input required type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                        <input required type="date" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                      </div>
                    </>
                  )}
                </div>
              </form>

              <div className="flex justify-center gap-4">
                <button type="button" onClick={() => setStep(2)} className="bg-gray-200 border border-gray-400 text-gray-800 px-6 py-1.5 font-bold hover:bg-gray-300">Back</button>
                <button
                  disabled={!category || !formData.name || !formData.mobile}
                  onClick={handlePayment}
                  className="bg-[#0f4a8a] text-white px-8 py-2 font-bold disabled:opacity-50 hover:bg-[#0c396b] transition-colors"
                >
                  Pay ₹{amount || "450"} Securely
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS E-RECEIPT */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto">
              {/* Success Banner */}
              <div className="border border-gray-300">
                <div className="bg-[#0f4a8a] text-white px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  <p className="text-sm font-bold">Payment Successful — e-Receipt Generated</p>
                </div>

                <div className="p-6 text-sm">
                  <h3 className="font-bold text-center text-lg mb-6 border-b border-gray-200 pb-2">
                    e-Receipt for State Bank Collect Payment
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    <p className="font-bold text-gray-600">SBCollect Reference Number</p>
                    <p className="font-black text-[#0f4a8a] text-base">{duNumber}</p>

                    <p className="font-bold text-gray-600">Category</p>
                    <p>{category}</p>

                    <p className="font-bold text-gray-600">Institution Name</p>
                    <p>SGGSIE&T, Nanded</p>

                    <p className="font-bold text-gray-600">Payee Name</p>
                    <p>{formData.name}</p>

                    <p className="font-bold text-gray-600">Designation</p>
                    <p>{formData.designation}</p>

                    <p className="font-bold text-gray-600">Purpose</p>
                    <p>{formData.purpose}</p>

                    <p className="font-bold text-gray-600">Mobile</p>
                    <p>{formData.mobile}</p>

                    <p className="font-bold text-gray-600">Total Amount Paid</p>
                    <p className="font-black">₹{amount || "450"}</p>

                    <p className="font-bold text-gray-600">Transaction Date</p>
                    <p>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>

                    <p className="font-bold text-gray-600">Transaction Status</p>
                    <p className="text-green-600 font-black flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed Successfully
                    </p>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 border-t border-amber-200 px-6 py-4">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-600" />
                    IMPORTANT: Save your DU Reference Number: <span className="text-[#0f4a8a] font-black ml-1">{duNumber}</span>
                  </p>
                  <p className="text-xs text-amber-700 mt-1 ml-6">
                    You will need this number to upload your receipt and claim your Room Pass.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-6 space-y-3">
                {/* PRIMARY: Go to Verify */}
                <button
                  onClick={handleProceedToVerify}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-sky-500/30"
                >
                  <ShieldCheck size={20} />
                  Proceed to Upload Receipt & Claim Room Pass
                  <ArrowRight size={20} />
                </button>

                {/* SECONDARY: Print */}
                <button
                  onClick={handlePrintReceipt}
                  className="w-full border-2 border-[#0f4a8a] text-[#0f4a8a] py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-blue-50"
                >
                  <Download size={16} />
                  Download / Print e-Receipt
                </button>

                {/* TERTIARY: Dashboard */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
                >
                  Return to Dashboard (Verify Later)
                </button>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-4">
                Your room allocation is subject to Rector's approval after receipt verification.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-100 p-4 text-center text-[10px] text-gray-500 border-t border-gray-300 mt-8">
          © State Bank of India | <span className="text-[#0f4a8a] cursor-pointer">Privacy Statement</span> | <span className="text-[#0f4a8a] cursor-pointer">Disclosure</span> | <span className="text-[#0f4a8a] cursor-pointer">Terms of Use</span>
        </div>
      </div>
    </div>
  );
}