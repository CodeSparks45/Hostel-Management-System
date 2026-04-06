import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Lock, Shield, Moon, Smartphone, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Settings() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSave = () => {
    toast.success("Preferences Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Toaster />
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">System Settings</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Menu */}
        <div className="md:col-span-4 space-y-2">
          <MenuButton icon={<Bell/>} label="Notifications" active />
          <MenuButton icon={<Lock/>} label="Security & Passwords" />
          <MenuButton icon={<Shield/>} label="Privacy & Data" />
          <MenuButton icon={<Moon/>} label="Appearance" />
        </div>

        {/* Right Content */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-8 space-y-6">
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Alert Preferences</h2>
            
            <div className="space-y-6">
              <ToggleRow 
                icon={<Smartphone className="text-sky-500" />} title="Push Notifications" desc="Get live updates on outpass and tickets on your device." 
                isOn={notifs} toggle={() => setNotifs(!notifs)} 
              />
              <div className="h-px bg-slate-100 w-full" />
              <ToggleRow 
                icon={<Bell className="text-amber-500" />} title="SMS Alerts" desc="Receive urgent broadcast messages from the Rector." 
                isOn={smsAlerts} toggle={() => setSmsAlerts(!smsAlerts)} 
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Change Password</h2>
            <div className="space-y-4">
              <input type="password" placeholder="Current Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-sky-400" />
              <input type="password" placeholder="New Password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-sky-400" />
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-extrabold uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-black transition-colors shadow-lg">
            <Save size={16} /> Save All Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function MenuButton({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-sm ${active ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-100 text-slate-500'}`}>
      {icon} {label}
    </button>
  );
}

function ToggleRow({ icon, title, desc, isOn, toggle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">{icon}</div>
        <div>
          <h4 className="font-extrabold text-slate-800">{title}</h4>
          <p className="text-xs font-medium text-slate-500 mt-1">{desc}</p>
        </div>
      </div>
      <button onClick={toggle} className={`w-14 h-8 rounded-full p-1 transition-colors ${isOn ? 'bg-sky-500' : 'bg-slate-300'}`}>
        <motion.div animate={{ x: isOn ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-md" />
      </button>
    </div>
  );
}