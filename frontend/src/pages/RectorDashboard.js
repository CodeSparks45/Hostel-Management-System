import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, CreditCard, AlertTriangle, CheckCircle, 
  BarChart3, Search, Filter, MoreVertical, Map 
} from "lucide-react";

export default function RectorDashboard() {
  const [activeTab, setActiveTab] = useState("Live");

  // Mock Data for Active Stays
  const activeStays = [
    { id: "DUJ882374", name: "Prof. S.R. Deshmukh", room: "A-102", status: "Verified", checkin: "08:30 AM" },
    { id: "DUJ119283", name: "Dr. Anjali Patil", room: "N-201", status: "Pending", checkin: "09:15 AM" },
    { id: "DUJ445566", name: "Guest: Mr. Rahul", room: "G-05", status: "Verified", checkin: "10:00 AM" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-['Inter']">
      
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#003366] text-white p-6 hidden lg:flex flex-col">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black italic tracking-tighter">StayPG <span className="text-orange-400">Admin</span></h2>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1">Rector Control Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<Map size={18}/>} label="Overview" active />
          <NavItem icon={<Users size={18}/>} label="Occupancy" />
          <NavItem icon={<CreditCard size={18}/>} label="Payments" />
          <NavItem icon={<BarChart3 size={18}/>} label="Analytics" />
        </nav>

        <div className="mt-auto bg-white/10 p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-bold opacity-50 mb-2 uppercase">Emergency Line</p>
          <p className="text-sm font-black text-orange-400">02462-229234</p>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3 text-gray-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search by DU Number or Name..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-800">Admin: Rector Office</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Online</p>
            </div>
            <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-[#003366]">R</div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total In-House" value="14" icon={<Users className="text-blue-500"/>} color="bg-blue-50" />
          <StatCard label="Pending Approval" value="03" icon={<AlertTriangle className="text-orange-500"/>} color="bg-orange-50" />
          <StatCard label="Revenue (Today)" value="₹6,450" icon={<CreditCard className="text-green-500"/>} color="bg-green-50" />
          <StatCard label="Total Capacity" value="84%" icon={<CheckCircle className="text-purple-500"/>} color="bg-purple-50" />
        </div>

        {/* Live Logs Table */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight">Live Occupancy Log</h3>
            <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
              <Filter size={14}/> Sort By: Latest
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">DU Reference</th>
                <th className="p-6">Guest Name</th>
                <th className="p-6">Room</th>
                <th className="p-6">Check-in</th>
                <th className="p-6">Status</th>
                <th className="p-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-gray-700">
              {activeStays.map((stay, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-mono text-xs">{stay.id}</td>
                  <td className="p-6">{stay.name}</td>
                  <td className="p-6">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-[10px]">{stay.room}</span>
                  </td>
                  <td className="p-6 text-gray-400 font-medium">{stay.checkin}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] ${
                      stay.status === "Verified" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {stay.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={16} className="text-gray-400"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

// ── SUB-COMPONENTS ──

function NavItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'hover:bg-white/5 opacity-60'
    }`}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
      <div className={`h-14 w-14 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <h4 className="text-2xl font-black text-gray-800">{value}</h4>
      </div>
    </div>
  );
}