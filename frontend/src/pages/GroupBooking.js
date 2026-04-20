import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Trash2, ArrowLeft, ArrowRight, Building2,
  User, Phone, Briefcase, CheckCircle2, AlertCircle,
  Loader2, Info, X, Lock, Unlock, Star, Wifi, Wind, Coffee
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

// ── Room Data (same as Home.js) ───────────────────────────────────
const ALL_ROOMS = [
  // Sahyadri Boys — AC
  { id: "sahyadri-A4",  number: "A4",  hostel: "Sahyadri Boys Hostel", type: "AC",     gender: "male",   price: 550, mongoId: "69db1d0e7aaf66498f96654f" },
  { id: "sahyadri-A10", number: "A10", hostel: "Sahyadri Boys Hostel", type: "AC",     gender: "male",   price: 550, mongoId: "69db1d0e7aaf66498f966550" },
  { id: "sahyadri-B4",  number: "B4",  hostel: "Sahyadri Boys Hostel", type: "AC",     gender: "male",   price: 550, mongoId: "69db1d0e7aaf66498f966551" },
  { id: "sahyadri-B10", number: "B10", hostel: "Sahyadri Boys Hostel", type: "AC",     gender: "male",   price: 550, mongoId: "" },
  // Sahyadri Boys — Non-AC
  { id: "sahyadri-A8",  number: "A8",  hostel: "Sahyadri Boys Hostel", type: "Non-AC", gender: "male",   price: 450, mongoId: "69db1d0e7aaf66498f966553" },
  { id: "sahyadri-A9",  number: "A9",  hostel: "Sahyadri Boys Hostel", type: "Non-AC", gender: "male",   price: 450, mongoId: "69db1d0e7aaf66498f966554" },
  { id: "sahyadri-B8",  number: "B8",  hostel: "Sahyadri Boys Hostel", type: "Non-AC", gender: "male",   price: 450, mongoId: "" },
  { id: "sahyadri-B9",  number: "B9",  hostel: "Sahyadri Boys Hostel", type: "Non-AC", gender: "male",   price: 450, mongoId: "" },
  // Krishna Girls — Non-AC
  { id: "krishna-A9",   number: "A9",  hostel: "Krishna Girls Hostel", type: "Non-AC", gender: "female", price: 450, mongoId: "" },
  { id: "krishna-A10",  number: "A10", hostel: "Krishna Girls Hostel", type: "Non-AC", gender: "female", price: 450, mongoId: "" },
];

const STEPS = ["Group Info", "Add Members", "Assign Rooms", "Review & Pay"];

export default function GroupBooking() {
  const navigate = useNavigate();
  const [step, setStep]               = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [roomAvailability, setRoomAvailability] = useState({});

  // Step 0 — Group Info
  const [groupName, setGroupName]     = useState("");
  const [purpose, setPurpose]         = useState("");
  const [organization, setOrg]        = useState("");

  // Step 1 — Members
  const [members, setMembers] = useState([
    { id: 1, name: "", designation: "", gender: "male",   mobile: "", assignedRoom: null },
    { id: 2, name: "", designation: "", gender: "female", mobile: "", assignedRoom: null },
  ]);

  // Fetch live room availability
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await API.get("/api/book/room-status");
      const map = {};
      res.data.rooms?.forEach(r => {
        map[r.number + "_" + r.hostel] = r.isBooked;
      });
      setRoomAvailability(map);
    } catch (e) {
      console.log("Availability fetch failed:", e.message);
    }
  };

  const isRoomAvailable = (room) => {
    const key = room.number + "_" + room.hostel;
    return !roomAvailability[key];
  };

  // Member helpers
  const addMember = () => {
    if (members.length >= 10) {
      toast.error("Maximum 10 members allowed per group.");
      return;
    }
    setMembers(prev => [
      ...prev,
      { id: Date.now(), name: "", designation: "", gender: "male", mobile: "", assignedRoom: null }
    ]);
  };

  const removeMember = (id) => {
    if (members.length <= 2) {
      toast.error("Minimum 2 members required for group booking.");
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const updateMember = (id, field, value) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== id) return m;
      // Gender change hone par room reset karo
      if (field === "gender") return { ...m, [field]: value, assignedRoom: null };
      return { ...m, [field]: value };
    }));
  };

  const assignRoom = (memberId, room) => {
    // Check: same room already assigned to another member?
    const alreadyAssigned = members.some(
      m => m.id !== memberId && m.assignedRoom?.id === room.id
    );
    if (alreadyAssigned) {
      toast.error(`Room ${room.number} already assigned to another member.`);
      return;
    }
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, assignedRoom: room } : m
    ));
  };

  // Validation per step
  const validateStep = () => {
    if (step === 0) {
      if (!groupName.trim()) { toast.error("Group name required."); return false; }
      if (!organization.trim()) { toast.error("Organization name required."); return false; }
      return true;
    }
    if (step === 1) {
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.name.trim()) { toast.error(`Member ${i + 1}: Name required.`); return false; }
        if (!m.mobile.trim() || m.mobile.length < 10) { toast.error(`Member ${i + 1}: Valid mobile required.`); return false; }
      }
      return true;
    }
    if (step === 2) {
      for (let i = 0; i < members.length; i++) {
        if (!members[i].assignedRoom) {
          toast.error(`Member ${i + 1} (${members[i].name || "?"}): Please assign a room.`);
          return false;
        }
      }
      return true;
    }
    return true;
  };

  const totalAmount = members.reduce((sum, m) => sum + (m.assignedRoom?.price || 0), 0);

  const handleProceedToPayment = () => {
    // Save group booking data to localStorage for SBCollect → VerifyPayment flow
    const groupData = {
      isGroup:      true,
      groupName,
      organization,
      purpose,
      totalAmount,
      members: members.map(m => ({
        name:        m.name,
        designation: m.designation,
        gender:      m.gender,
        mobile:      m.mobile,
        roomNumber:  m.assignedRoom.number,
        hostelName:  m.assignedRoom.hostel,
        roomId:      m.assignedRoom.mongoId,
        price:       m.assignedRoom.price,
      })),
    };
    localStorage.setItem("groupBookingSession", JSON.stringify(groupData));

    toast.loading("Redirecting to SBI Secure Payment...");
    setTimeout(() => {
      toast.dismiss();
      navigate(`/payment-gateway/group/${totalAmount}`);
    }, 1200);
  };

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Toaster position="top-right" />

      {/* ── HEADER ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-5 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/home")}
            className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all">
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 leading-none">Group Booking</h1>
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-0.5">
              {STEPS[step]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Step {step + 1} of {STEPS.length}
          </span>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all ${
                i < step ? "w-6 bg-emerald-400" :
                i === step ? "w-6 bg-sky-500" : "w-2 bg-slate-200"
              }`} />
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: GROUP INFO ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-sky-500 to-teal-400 rounded-[2rem] p-7 mb-7 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                    <Users size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-1">Group / Corporate Booking</h2>
                  <p className="text-sm text-sky-50 font-medium leading-relaxed max-w-lg">
                    Book multiple rooms for your entire group in one go. Male and female members 
                    are automatically assigned to the correct hostel — no separate logins needed.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    {[
                      { icon: "👥", text: "2–10 Members" },
                      { icon: "🏨", text: "Mixed Gender OK" },
                      { icon: "💳", text: "Single Payment" },
                      { icon: "📧", text: "One Email Summary" },
                    ].map((f, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                        {f.icon} {f.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm space-y-5">
                <h3 className="text-lg font-extrabold text-slate-800 mb-5">Group Details</h3>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Group / Delegation Name *</label>
                  <input
                    type="text" value={groupName} onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. TechCorp Recruitment Team 2026"
                    className="w-full py-3.5 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Organization / Company *</label>
                  <input
                    type="text" value={organization} onChange={e => setOrg(e.target.value)}
                    placeholder="e.g. Infosys Limited, Pune"
                    className="w-full py-3.5 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Purpose of Visit *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Campus Recruitment", "Industry Visit", "Board Meeting",
                      "NAAC / AICTE Review", "Research Collaboration", "Other"
                    ].map(p => (
                      <button key={p} type="button" onClick={() => setPurpose(p)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left ${
                          purpose === p
                            ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20"
                            : "bg-slate-50 text-slate-600 border-slate-100 hover:border-sky-200 hover:bg-sky-50"
                        }`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                  <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-amber-700 leading-relaxed">
                    <strong>Leader Note:</strong> You (the person booking) will receive the consolidated email with all room allocations. 
                    Individual QR passes will be accessible from My Bookings.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1: ADD MEMBERS ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">{groupName}</h2>
                  <p className="text-sm text-slate-400 font-medium mt-0.5">{organization} · {purpose}</p>
                </div>
                <div className="bg-sky-50 border border-sky-100 px-4 py-2 rounded-xl text-center">
                  <p className="text-2xl font-black text-sky-600">{members.length}</p>
                  <p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Members</p>
                </div>
              </div>

              <div className="space-y-4 mb-5">
                {members.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[1.75rem] p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-extrabold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-800">{m.name || `Member ${i + 1}`}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${m.gender === "female" ? "text-rose-500" : "text-sky-500"}`}>
                            {m.gender === "female" ? "♀ Female" : "♂ Male"}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeMember(m.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name *</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={m.name} onChange={e => updateMember(m.id, "name", e.target.value)}
                            placeholder="Dr. / Prof. / Mr. / Ms."
                            className="w-full py-3 pl-9 pr-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Designation</label>
                        <div className="relative">
                          <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={m.designation} onChange={e => updateMember(m.id, "designation", e.target.value)}
                            placeholder="HR Manager / Senior Engineer"
                            className="w-full py-3 pl-9 pr-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Mobile *</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="tel" value={m.mobile} onChange={e => updateMember(m.id, "mobile", e.target.value)}
                            placeholder="10-digit number"
                            className="w-full py-3 pl-9 pr-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Gender *</label>
                        <div className="flex gap-2">
                          {["male", "female"].map(g => (
                            <button key={g} type="button" onClick={() => updateMember(m.id, "gender", g)}
                              className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                                m.gender === g
                                  ? g === "male"
                                    ? "bg-sky-500 text-white border-sky-500"
                                    : "bg-rose-500 text-white border-rose-500"
                                  : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                              }`}>
                              {g === "male" ? "♂ Male" : "♀ Female"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Member Button */}
              {members.length < 10 && (
                <button onClick={addMember}
                  className="w-full py-4 border-2 border-dashed border-sky-200 rounded-[1.75rem] text-sky-500 hover:bg-sky-50 hover:border-sky-400 transition-all font-bold text-sm flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Another Member
                  <span className="text-xs text-slate-400">({members.length}/10)</span>
                </button>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: ASSIGN ROOMS ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-800 mb-1">Assign Rooms</h2>
                <p className="text-sm text-slate-400 font-medium">
                  Male members can only see Sahyadri Boys Hostel rooms, female members see Krishna Girls Hostel rooms.
                  Gender lock is automatically handled.
                </p>
              </div>

              <div className="space-y-6">
                {members.map((m, i) => {
                  const compatibleRooms = ALL_ROOMS.filter(r => r.gender === m.gender);
                  const assignedByOthers = members
                    .filter(other => other.id !== m.id && other.assignedRoom)
                    .map(other => other.assignedRoom?.id);

                  return (
                    <div key={m.id} className="bg-white rounded-[1.75rem] p-5 border border-slate-100 shadow-sm">
                      {/* Member Header */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                          m.gender === "female" ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600"
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800">{m.name || `Member ${i + 1}`}</p>
                          <p className="text-xs font-bold text-slate-400">{m.designation || "—"} · {m.gender === "female" ? "♀ Female" : "♂ Male"}</p>
                        </div>
                        {m.assignedRoom && (
                          <div className="ml-auto flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-100">
                            <CheckCircle2 size={13} /> Room {m.assignedRoom.number}
                          </div>
                        )}
                      </div>

                      {/* Room Options */}
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {m.gender === "male" ? "Sahyadri Boys Hostel" : "Krishna Girls Hostel"} — Select Room
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {compatibleRooms.map(room => {
                          const available  = isRoomAvailable(room);
                          const takenByOther = assignedByOthers.includes(room.id);
                          const isSelected  = m.assignedRoom?.id === room.id;
                          const disabled    = !available || takenByOther;

                          return (
                            <button key={room.id} onClick={() => !disabled && assignRoom(m.id, room)}
                              disabled={disabled}
                              className={`p-3 rounded-2xl border-2 transition-all text-left ${
                                isSelected
                                  ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/20"
                                  : disabled
                                    ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                                    : "bg-white border-slate-100 hover:border-sky-300 hover:shadow-md cursor-pointer"
                              }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-sm font-extrabold ${isSelected ? "text-white" : "text-slate-800"}`}>
                                  {room.number}
                                </span>
                                {disabled
                                  ? <Lock size={11} className="text-slate-400" />
                                  : isSelected
                                    ? <CheckCircle2 size={13} className="text-white" />
                                    : <Unlock size={11} className="text-slate-400" />
                                }
                              </div>
                              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                                isSelected ? "text-sky-100" : "text-slate-400"
                              }`}>{room.type}</p>
                              <p className={`text-xs font-extrabold ${isSelected ? "text-white" : "text-slate-700"}`}>
                                ₹{room.price}
                              </p>
                              {takenByOther && (
                                <p className="text-[9px] font-bold text-rose-400 mt-0.5">Taken</p>
                              )}
                              {!available && !takenByOther && (
                                <p className="text-[9px] font-bold text-rose-400 mt-0.5">Booked</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: REVIEW ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl font-extrabold text-slate-800 mb-5">Review & Confirm</h2>

              {/* Group Summary */}
              <div className="bg-gradient-to-br from-sky-500 to-teal-400 rounded-[2rem] p-6 text-white mb-5 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-sky-100 uppercase tracking-widest mb-1">Group Booking Summary</p>
                  <h3 className="text-xl font-extrabold mb-0.5">{groupName}</h3>
                  <p className="text-sm text-sky-50 font-medium">{organization} · {purpose}</p>
                  <div className="flex gap-6 mt-5 pt-5 border-t border-white/20">
                    <div>
                      <p className="text-[9px] text-sky-100 font-bold uppercase tracking-widest mb-0.5">Members</p>
                      <p className="text-2xl font-extrabold">{members.length}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-sky-100 font-bold uppercase tracking-widest mb-0.5">Total Amount</p>
                      <p className="text-2xl font-extrabold">₹{totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-sky-100 font-bold uppercase tracking-widest mb-0.5">Duration</p>
                      <p className="text-2xl font-extrabold">1 Day</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Allocation Table */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-5">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-800">Member Room Allocation</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-5 py-3">#</th>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Designation</th>
                        <th className="px-5 py-3">Gender</th>
                        <th className="px-5 py-3">Room</th>
                        <th className="px-5 py-3">Hostel</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m, i) => (
                        <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="px-5 py-3.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                              m.gender === "female" ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600"
                            }`}>{i + 1}</div>
                          </td>
                          <td className="px-5 py-3.5 font-extrabold text-sm text-slate-800">{m.name}</td>
                          <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{m.designation || "—"}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                              m.gender === "female" ? "text-rose-500" : "text-sky-500"
                            }`}>
                              {m.gender === "female" ? "♀ Female" : "♂ Male"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-extrabold text-sky-600 text-sm">Room {m.assignedRoom?.number}</span>
                            <span className={`ml-2 text-[9px] font-bold uppercase tracking-widest ${
                              m.assignedRoom?.type === "AC" ? "text-blue-500" : "text-slate-400"
                            }`}>{m.assignedRoom?.type}</span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500 font-bold">{m.assignedRoom?.hostel}</td>
                          <td className="px-5 py-3.5 text-right font-extrabold text-slate-800">₹{m.assignedRoom?.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td colSpan={6} className="px-5 py-3.5 font-extrabold text-slate-700 text-sm">Total</td>
                        <td className="px-5 py-3.5 text-right font-extrabold text-sky-600 text-lg">₹{totalAmount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Process Info */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-5">
                <p className="text-xs font-extrabold text-slate-600 uppercase tracking-widest mb-3">What Happens Next</p>
                {[
                  { n: 1, t: "SBI Collect Payment", d: `Pay ₹${totalAmount} for all ${members.length} members in one transaction.` },
                  { n: 2, t: "Upload Receipt", d: "Upload the single e-Receipt with your DU Reference Number." },
                  { n: 3, t: "Rector Approval", d: "Rector reviews all room allocations and approves in one click." },
                  { n: 4, t: "Email & QR Passes", d: "You receive a consolidated email. Individual QR passes available in My Bookings." },
                ].map(s => (
                  <div key={s.n} className="flex gap-3 items-start mb-3 last:mb-0">
                    <div className="w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 mt-0.5">{s.n}</div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">{s.t}</p>
                      <p className="text-xs text-slate-400 font-medium">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Proceed Button */}
              <button onClick={handleProceedToPayment}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-[1.75rem] font-extrabold uppercase text-sm tracking-[0.15em] shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-3 active:scale-95">
                Proceed to SBI Collect Payment
                <ArrowRight size={20} />
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                ₹{totalAmount} total · {members.length} rooms · Secure Payment
              </p>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── NAVIGATION BUTTONS ── */}
        {step < 3 && (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">
                ← Back
              </button>
            )}
            <button
              onClick={() => { if (validateStep()) setStep(s => s + 1); }}
              className="flex-1 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
              {step === 2 ? "Review Booking" : "Continue"} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}