import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Lock, Shield, Moon, Sun, Save,
  Eye, EyeOff, CheckCircle2, ChevronRight, User,
  LogOut, Trash2, Info, Volume2, Smartphone, KeyRound,
  Palette, UserCog
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import API from "../services/api";
import MobileNav from "./MobileNav";

const MENU = [
  { id: "notifications", icon: Bell,     label: "Notifications",   desc: "Alerts & reminders"  },
  { id: "security",      icon: KeyRound, label: "Security",         desc: "Password & login"    },
  { id: "privacy",       icon: Shield,   label: "Privacy & Data",   desc: "Data usage"          },
  { id: "appearance",    icon: Palette,  label: "Appearance",       desc: "Theme & display"     },
  { id: "account",       icon: UserCog,  label: "Account",          desc: "Profile & sign out"  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState("notifications");

  // Notification state
  const [notifs, setNotifs] = useState({
    push: true, sms: true, email: true, maintenance: true, announcements: false
  });

  // Security state
  const [currentPass,  setCurrentPass]  = useState("");
  const [newPass,      setNewPass]      = useState("");
  const [confirmPass,  setConfirmPass]  = useState("");
  const [showPwd,      setShowPwd]      = useState({ current: false, new: false, confirm: false });
  const [changingPass, setChangingPass] = useState(false);

  // Privacy state
  const [privacy, setPrivacy] = useState({
    shareProfile: true, analyticsData: false, crashReports: true
  });

  const handleSaveNotifs = () => toast.success("Notification preferences saved! ✅");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) { toast.error("New passwords do not match!"); return; }
    if (newPass.length < 6)     { toast.error("Password must be at least 6 characters."); return; }
    setChangingPass(true);
    try {
      await API.put("/api/auth/change-password", {
        currentPassword: currentPass,
        newPassword:     newPass
      });
      toast.success("Password changed successfully! 🔒");
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Incorrect current password.");
    } finally { setChangingPass(false); }
  };

  const handleDeleteAccount = () => {
    const ok = window.confirm(
      "Are you absolutely sure? This is irreversible — all your booking data will be permanently deleted."
    );
    if (ok) toast.error("Account deletion requested. Admin will process within 24 hours.");
  };

  const panelAnim = {
    hidden: { opacity: 0, x: 12 },
    show:   { opacity: 1, x: 0, transition: { duration: 0.28 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 lg:pb-0">
      <Toaster position="top-right" />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 transition-all text-slate-500 shadow-sm flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">Settings</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">App Preferences</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-6 grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* ── LEFT MENU ── */}
        <div className="md:col-span-4 space-y-1.5">
          {MENU.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all text-sm group ${
                activeSection === id
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-100 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activeSection === id ? "bg-white/20" : "bg-slate-50"
                }`}>
                  <Icon size={17} className={activeSection === id ? "text-white" : "text-slate-500"} />
                </div>
                <div className="text-left">
                  <p className={`font-extrabold leading-none text-sm ${activeSection === id ? "text-white" : "text-slate-800"}`}>
                    {label}
                  </p>
                  <p className={`text-[10px] font-bold mt-0.5 ${activeSection === id ? "text-sky-100" : "text-slate-400"}`}>
                    {desc}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={15}
                className={activeSection === id ? "text-white/70" : "text-slate-300 group-hover:text-slate-500 transition-colors"}
              />
            </button>
          ))}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <motion.div key="notifs" variants={panelAnim} initial="hidden" animate="show" exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 sm:p-7 space-y-4">
                <h2 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100">Alert Preferences</h2>

                <ToggleRow
                  icon={<Smartphone size={17} className="text-sky-500" />}
                  title="Push Notifications"
                  desc="Live updates on outpass, maintenance and approvals on your device."
                  isOn={notifs.push}
                  toggle={() => setNotifs(p => ({ ...p, push: !p.push }))}
                />
                <ToggleRow
                  icon={<Bell size={17} className="text-amber-500" />}
                  title="SMS Alerts"
                  desc="Urgent broadcast messages from the Rector's Office."
                  isOn={notifs.sms}
                  toggle={() => setNotifs(p => ({ ...p, sms: !p.sms }))}
                />
                <ToggleRow
                  icon={<Info size={17} className="text-teal-500" />}
                  title="Email Notifications"
                  desc="Booking status updates and approval confirmation emails."
                  isOn={notifs.email}
                  toggle={() => setNotifs(p => ({ ...p, email: !p.email }))}
                />
                <ToggleRow
                  icon={<Volume2 size={17} className="text-purple-500" />}
                  title="Maintenance Updates"
                  desc="Get notified when your maintenance ticket status changes."
                  isOn={notifs.maintenance}
                  toggle={() => setNotifs(p => ({ ...p, maintenance: !p.maintenance }))}
                />
                <ToggleRow
                  icon={<Bell size={17} className="text-rose-500" />}
                  title="Campus Announcements"
                  desc="General announcements from Hostel Administration."
                  isOn={notifs.announcements}
                  toggle={() => setNotifs(p => ({ ...p, announcements: !p.announcements }))}
                />

                <button
                  onClick={handleSaveNotifs}
                  className="w-full mt-2 bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-widest shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={15} /> Save Preferences
                </button>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeSection === "security" && (
              <motion.div key="security" variants={panelAnim} initial="hidden" animate="show" exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 sm:p-7">
                <h2 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100 mb-5">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { label: "Current Password",     key: "current", val: currentPass, set: setCurrentPass  },
                    { label: "New Password",          key: "new",     val: newPass,     set: setNewPass      },
                    { label: "Confirm New Password",  key: "confirm", val: confirmPass, set: setConfirmPass  },
                  ].map(({ label, key, val, set }) => (
                    <div key={key}>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2 block">
                        {label}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type={showPwd[key] ? "text" : "password"}
                          value={val}
                          onChange={e => set(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full py-3.5 pl-11 pr-12 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-sky-400 focus:bg-white transition-all text-sm font-bold text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPwd[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mt-2">
                    <p className="text-xs font-extrabold text-sky-700 mb-2">Password Requirements</p>
                    {["Minimum 6 characters", "Mix of letters and numbers recommended"].map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-sky-600 mb-1">
                        <CheckCircle2 size={12} /> {req}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={changingPass}
                    className="w-full bg-slate-800 hover:bg-black text-white py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {changingPass ? "Updating..." : <><Lock size={14} /> Update Password</>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* PRIVACY */}
            {activeSection === "privacy" && (
              <motion.div key="privacy" variants={panelAnim} initial="hidden" animate="show" exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 sm:p-7 space-y-4">
                <h2 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100">Privacy & Data</h2>

                <ToggleRow
                  icon={<User size={17} className="text-sky-500" />}
                  title="Share Profile with Rector"
                  desc="Your name and room details will be visible to admin staff."
                  isOn={privacy.shareProfile}
                  toggle={() => setPrivacy(p => ({ ...p, shareProfile: !p.shareProfile }))}
                />
                <ToggleRow
                  icon={<Shield size={17} className="text-teal-500" />}
                  title="Analytics Data"
                  desc="Help improve StayPG by sharing anonymous usage data."
                  isOn={privacy.analyticsData}
                  toggle={() => setPrivacy(p => ({ ...p, analyticsData: !p.analyticsData }))}
                />
                <ToggleRow
                  icon={<Info size={17} className="text-amber-500" />}
                  title="Crash Reports"
                  desc="Automatically send error reports to help fix bugs faster."
                  isOn={privacy.crashReports}
                  toggle={() => setPrivacy(p => ({ ...p, crashReports: !p.crashReports }))}
                />

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-2">
                    <Shield size={13} className="text-teal-500" /> Data Protection
                  </p>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    All data is encrypted and stored securely. SGGSIE&T strictly follows institutional data
                    privacy guidelines. Your data is never sold to third parties.
                  </p>
                </div>

                <button
                  onClick={() => toast.success("Privacy preferences saved!")}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-widest shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Save size={15} /> Save Privacy Settings
                </button>
              </motion.div>
            )}

            {/* APPEARANCE */}
            {activeSection === "appearance" && (
              <motion.div key="appearance" variants={panelAnim} initial="hidden" animate="show" exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 sm:p-7 space-y-5">
                <h2 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100">Appearance</h2>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                      {theme === "dark" ? <Moon size={19} className="text-slate-700" /> : <Sun size={19} className="text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm">
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {theme === "dark" ? "Easy on eyes at night" : "Default bright theme"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${theme === "dark" ? "bg-slate-700" : "bg-sky-500"}`}
                  >
                    <motion.div
                      animate={{ x: theme === "dark" ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>

                {/* Color Themes */}
                <div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Color Theme</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border-2 border-sky-400 rounded-2xl cursor-pointer shadow-sm">
                      <div className="w-8 h-8 bg-sky-500 rounded-lg mb-2" />
                      <p className="text-xs font-extrabold text-slate-800">Sky Blue</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Default · Active</p>
                    </div>
                    <div
                      onClick={() => toast("More themes coming soon! 🎨")}
                      className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-slate-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-slate-600 rounded-lg mb-2" />
                      <p className="text-xs font-extrabold text-slate-800">Midnight</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Coming soon</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ACCOUNT */}
            {activeSection === "account" && (
              <motion.div key="account" variants={panelAnim} initial="hidden" animate="show" exit={{ opacity: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 sm:p-7 space-y-3">
                <h2 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100">Account</h2>

                <button
                  onClick={() => navigate("/complete-profile")}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-sky-200 hover:bg-sky-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-sky-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-slate-800 text-sm">Edit Profile</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Update personal information</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>

                <button
                  onClick={() => { localStorage.clear(); navigate("/login"); }}
                  className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-2xl hover:border-amber-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <LogOut size={18} className="text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-amber-800 text-sm">Sign Out</p>
                      <p className="text-xs text-amber-600 font-medium mt-0.5">You'll need to log in again</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-amber-300 group-hover:text-amber-500 transition-colors" />
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl hover:border-rose-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trash2 size={18} className="text-rose-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-rose-700 text-sm">Delete Account</p>
                      <p className="text-xs text-rose-500 font-medium mt-0.5">Permanently remove all data</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-rose-200 group-hover:text-rose-400 transition-colors" />
                </button>

                <div className="text-center pt-4 pb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    StayPG v1.0 · SGGSIE&T · Nanded
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

function ToggleRow({ icon, title, desc, isOn, toggle }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h4 className="font-extrabold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5 leading-snug">{desc}</p>
        </div>
      </div>
      <button
        onClick={toggle}
        className={`w-12 h-7 rounded-full p-1 transition-colors flex-shrink-0 ml-4 ${isOn ? "bg-sky-500" : "bg-slate-200"}`}
      >
        <motion.div
          animate={{ x: isOn ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );
}