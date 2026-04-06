import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckSquare, Info, Shield, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SBCollectSimulate() {
  const { id, amount } = useParams();
  const navigate = useNavigate();
  
  // Real SBI Collect Flow States
  const [step, setStep] = useState(0); 
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [state, setState] = useState("");
  const [instType, setInstType] = useState("");
  const [instName, setInstName] = useState("");
  const [category, setCategory] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    mobile: "",
    dob: "",
  });

  const [duNumber, setDuNumber] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Processing transaction via Secure Bank Gateway...");
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      const randomDU = "DU" + Math.floor(10000000 + Math.random() * 90000000);
      setDuNumber(randomDU);
      setStep(4);
      toast.success("Transaction Successful");
    }, 2500);
  };

  const returnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans text-[#333]">
      <Toaster />
      
      {/* CLASSIC SBI HEADER */}
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

      {/* MAIN CONTAINER */}
      <div className="max-w-4xl mx-auto mt-8 bg-white border border-gray-300 shadow-md">
        
        <div className="bg-[#0f4a8a] text-white px-4 py-2 text-sm font-bold">
          STATE BANK COLLECT
        </div>

        <div className="p-6">
          
          {/* STEP 0: TERMS AND CONDITIONS */}
          {step === 0 && (
            <div>
              <h2 className="text-[#0f4a8a] text-lg font-bold border-b border-gray-200 pb-2 mb-4">Terms Used</h2>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5 mb-6">
                <li>Corporate Customer: Firm/Company/Institution (F/C/I) collecting payment from their beneficiaries.</li>
                <li>User: The beneficiary making a payment to F/C/I for the services/goods availed.</li>
                <li>Bank shall not be responsible, in any way, for the quality or merchantability of any product/merchandise or any of the services related thereto, whatsoever, offered to the User by the Corporate Customer.</li>
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
                  <br/><span className="text-gray-500 font-normal">(Click Check Box to proceed for payment.)</span>
                </label>
              </div>

              <div className="flex justify-center">
                <button 
                  disabled={!termsAccepted}
                  onClick={() => setStep(1)}
                  className="bg-[#0f4a8a] text-white px-8 py-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0c396b]"
                >
                  Proceed
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: STATE & TYPE */}
          {step === 1 && (
            <div>
              <h2 className="text-[#0f4a8a] text-lg font-bold border-b border-gray-200 pb-2 mb-6">Select State and Type of Corporate / Institution</h2>
              
              <div className="max-w-md mx-auto space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-700">State of Corporate / Institution <span className="text-red-500">*</span></label>
                  <select 
                    className="border border-gray-400 p-1.5 text-sm w-full sm:w-48 bg-white"
                    value={state} onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">--Select State--</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-700">Type of Corporate / Institution <span className="text-red-500">*</span></label>
                  <select 
                    className="border border-gray-400 p-1.5 text-sm w-full sm:w-48 bg-white"
                    value={instType} onChange={(e) => setInstType(e.target.value)}
                  >
                    <option value="">--Select Type--</option>
                    <option value="Educational Institutions">Educational Institutions</option>
                    <option value="Govt Department">Govt Department</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={() => setStep(0)} className="bg-gray-200 border border-gray-400 text-gray-800 px-6 py-1.5 font-bold hover:bg-gray-300">Back</button>
                <button 
                  disabled={!state || !instType}
                  onClick={() => setStep(2)}
                  className="bg-[#0f4a8a] text-white px-6 py-1.5 font-bold disabled:opacity-50 hover:bg-[#0c396b]"
                >
                  Go
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INSTITUTION NAME */}
          {step === 2 && (
            <div>
              <h2 className="text-[#0f4a8a] text-lg font-bold border-b border-gray-200 pb-2 mb-6">Select from Educational Institutions</h2>
              
              <div className="max-w-xl mx-auto space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-bold text-gray-700">Educational Institutions Name <span className="text-red-500">*</span></label>
                  <select 
                    className="border border-gray-400 p-1.5 text-sm w-full sm:w-64 bg-white"
                    value={instName} onChange={(e) => setInstName(e.target.value)}
                  >
                    <option value="">--Select Institution--</option>
                    <option value="SGGSIE&T">SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGG & TECH</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={() => setStep(1)} className="bg-gray-200 border border-gray-400 text-gray-800 px-6 py-1.5 font-bold hover:bg-gray-300">Back</button>
                <button 
                  disabled={!instName}
                  onClick={() => setStep(3)}
                  className="bg-[#0f4a8a] text-white px-6 py-1.5 font-bold disabled:opacity-50 hover:bg-[#0c396b]"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT DETAILS FORM */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs text-center font-bold text-gray-500">
                  Logo
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
                    </select>
                  </div>

                  {category && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Student Name <span className="text-red-500">*</span></label>
                        <input required type="text" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Registration / Reg No <span className="text-red-500">*</span></label>
                        <input required type="text" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Amount <span className="text-red-500">*</span></label>
                        <input readOnly type="text" className="border border-gray-400 p-1.5 w-full sm:w-2/3 bg-gray-100" value={amount || "450"} />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Remarks</label>
                        <textarea className="border border-gray-400 p-1.5 w-full sm:w-2/3" placeholder="Hostel Block: Sahyadri Elite"></textarea>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs text-gray-700 mt-4">
                        Please enter your Name, Date of Birth (For Personal Banking) / Incorporation (For Corporate Banking) & Mobile Number. This is required to reprint your e-receipt / remittance(PAP) form, if the need arises.
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                        <input required type="text" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <label className="sm:w-1/3 font-bold text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                        <input required type="date" className="border border-gray-400 p-1.5 w-full sm:w-2/3" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                      </div>
                    </>
                  )}
                </div>
              </form>

              <div className="flex justify-center gap-4">
                <button type="button" onClick={() => setStep(2)} className="bg-gray-200 border border-gray-400 text-gray-800 px-6 py-1.5 font-bold hover:bg-gray-300">Back</button>
                <button 
                  disabled={!category}
                  onClick={handlePayment}
                  className="bg-[#0f4a8a] text-white px-6 py-1.5 font-bold disabled:opacity-50 hover:bg-[#0c396b]"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS E-RECEIPT */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto">
              <div className="border border-gray-300">
                <div className="bg-[#0f4a8a] text-white px-4 py-2 flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <p className="text-sm font-bold">Payment done successfully</p>
                </div>
                <div className="p-6 text-sm">
                  <h3 className="font-bold text-center text-lg mb-6 border-b border-gray-200 pb-2">e-Receipt for State Bank Collect Payment</h3>
                  
                  <div className="grid grid-cols-2 gap-y-4">
                    <p className="font-bold text-gray-600">SBCollect Reference Number</p>
                    <p className="font-bold">{duNumber}</p>
                    
                    <p className="font-bold text-gray-600">Category</p>
                    <p>{category}</p>
                    
                    <p className="font-bold text-gray-600">Institution Name</p>
                    <p>SGGSIE&T</p>
                    
                    <p className="font-bold text-gray-600">Student Name</p>
                    <p>{formData.name}</p>

                    <p className="font-bold text-gray-600">Registration Number</p>
                    <p>{formData.rollNo}</p>

                    <p className="font-bold text-gray-600">Total Amount</p>
                    <p>₹{amount || "450"}</p>
                    
                    <p className="font-bold text-gray-600">Transaction Status</p>
                    <p className="text-green-600 font-bold">Completed Successfully</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={returnToDashboard}
                  className="bg-[#0f4a8a] text-white px-8 py-2 font-bold hover:bg-[#0c396b]"
                >
                  Return to StayPG Dashboard
                </button>
              </div>
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