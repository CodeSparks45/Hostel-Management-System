import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Send, Sparkles, Bot, User, Clock, Utensils, 
  Wrench, Wifi, BookOpen, Search, Moon, Briefcase, Trash2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpBot() {
  const navigate = useNavigate();
  
  // Format current time
  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState([
    { 
      text: "Hello! I am your StayPG AI Concierge. I can help you with mess menus, outpasses, maintenance, campus rules, and more. How can I assist you today?", 
      sender: "bot",
      time: getCurrentTime()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages, isTyping]);

  // Clear Chat function
  const handleClearChat = () => {
    setMessages([{ 
      text: "Chat memory cleared. How can I help you from scratch?", 
      sender: "bot",
      time: getCurrentTime()
    }]);
  };

  // Expanded Smart Response Engine
  const generateBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/\b(hi|hello|hey|namaste|morning|evening)\b/)) {
      return "Hello there! How can I make your StayPG experience better today?";
    }
    if (lowerText.match(/\b(mess|food|dinner|lunch|menu|eat|hungry|breakfast)\b/)) {
      return "Today's menu at the central mess:\n• Breakfast: Poha & Jalebi (7:30 AM - 9:00 AM)\n• Lunch: Rajma Chawal (12:30 PM - 2:00 PM)\n• Dinner: Paneer Butter Masala (8:00 PM - 10:00 PM)\nYou can skip meals from your Dashboard to avoid food waste!";
    }
    if (lowerText.match(/\b(outpass|leave|home|going out|gate pass)\b/)) {
      return "You can generate a Smart Gate Pass directly from your dashboard under 'Quick Actions'. It requires Warden approval, which usually takes about 1-2 hours.";
    }
    if (lowerText.match(/\b(broken|fan|light|plumber|repair|maintenance|water|cleaning|clean|electrician)\b/)) {
      return "I can help with that! Please raise a 'Maintenance Ticket' from your Dashboard. Select the category (e.g., Electrical, Plumbing) and a technician will be assigned within 24 hours.";
    }
    if (lowerText.match(/\b(fee|pay|sbi|receipt|du number|payment|money|duj)\b/)) {
      return "Hostel fees are processed via SBI Collect. Once you make the payment, please go to the 'Verify Pass' section on your dashboard and upload your DU Reference Number and receipt to claim your room.";
    }
    if (lowerText.match(/\b(room|book|change room|hostel|explore|shift)\b/)) {
      return "You can check available rooms, capacities, and pricing in the 'Explore Hostels' section. Bookings for the 2024-25 academic year are currently open!";
    }
    if (lowerText.match(/\b(wifi|internet|network|eduroam|connect)\b/)) {
      return "For campus Wi-Fi (SGGSIE&T-Net) issues, please ensure your MAC address is registered on the IT portal. If you still face issues, visit the CCF center on the first floor during college hours.";
    }
    if (lowerText.match(/\b(library|study|books|reading)\b/)) {
      return "The central library is open from 8:00 AM to 12:00 Midnight during regular academic days. During exam weeks, the reading room is open 24/7.";
    }
    if (lowerText.match(/\b(curfew|time|late|entry|close)\b/)) {
      return "The campus hostel curfew is strictly 10:30 PM. If you are arriving late due to a delayed train/bus, please inform your respective block warden in advance to avoid a fine.";
    }
    if (lowerText.match(/\b(lost|found|missing|stolen)\b/)) {
      return "If you've lost or found an item, please report it to the Main Gate Security Cabin. They maintain the official campus Lost & Found register.";
    }
    if (lowerText.match(/\b(laundry|clothes|wash|washing)\b/)) {
      return "Laundry services are available near the Nandgiri block. It operates from 9:00 AM to 6:00 PM. Drop off your clothes before 10:00 AM for next-day delivery.";
    }
    if (lowerText.match(/\b(rector|warden|office|complaint)\b/)) {
      return "The Chief Rector's office is located on the ground floor of Sahyadri Block A. Office hours for student queries are 4:00 PM to 6:00 PM on weekdays.";
    }
    if (lowerText.match(/\b(help|emergency|medical|police|fire|sos|ambulance)\b/)) {
      return "🚨 If this is an emergency, please use the red SOS button on your dashboard immediately, or contact Campus Security directly at 02462-229234.";
    }
    if (lowerText.match(/\b(thanks|thank you|bye|ok|okay|awesome|great)\b/)) {
      return "You're very welcome! I'm here 24/7 if you need anything else.";
    }

    // Fallback Response
    return "I am still learning the ins and outs of SGGSIE&T! Could you rephrase that, or try looking in the Quick Actions menu on your main dashboard?";
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text, sender: "user", time: getCurrentTime() }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const reply = generateBotResponse(text);
      setMessages(prev => [...prev, { text: reply, sender: "bot", time: getCurrentTime() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="h-screen bg-sky-50/50 font-sans flex flex-col relative overflow-hidden text-slate-800 selection:bg-sky-500 selection:text-white">
      
      {/* ─── SOFT BACKGROUND GLOWS ─── */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-200/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-100/40 blur-[120px] rounded-full pointer-events-none" />

      {/* ─── HEADER ─── */}
      <header className="relative z-20 flex items-center justify-between p-6 bg-white/80 backdrop-blur-xl border-b border-sky-100 shadow-sm">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 border border-slate-100 hover:bg-sky-50 hover:text-sky-600 rounded-full flex items-center justify-center text-slate-500 transition-colors shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20}/> StayPG Concierge
              </h1>
              <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> AI Online
              </p>
            </div>
          </div>
          <button 
            onClick={handleClearChat}
            title="Clear Chat History"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      {/* ─── CHAT AREA ─── */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 relative z-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
                className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 shadow-sm border border-sky-200 flex-shrink-0">
                    <Bot size={20} />
                  </div>
                )}
                
                <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-xs md:max-w-md p-4 text-sm font-medium leading-relaxed whitespace-pre-line ${
                    msg.sender === "user" 
                    ? "bg-gradient-to-tr from-sky-500 to-sky-400 text-white rounded-[2rem] rounded-br-none shadow-md shadow-sky-500/20" 
                    : "bg-white border border-sky-100 text-slate-700 rounded-[2rem] rounded-bl-none shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 px-2">{msg.time}</span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-sm border border-slate-700 flex-shrink-0">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* AI TYPING INDICATOR */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3 justify-start">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 shadow-sm border border-sky-200 flex-shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-sky-100 text-slate-700 rounded-[2rem] rounded-bl-none shadow-sm px-5 py-5 flex gap-1 items-center">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-sky-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-sky-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-sky-400 rounded-full" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ─── QUICK PROMPTS (SCROLLABLE CAROUSEL) ─── */}
      <div className="px-6 md:px-10 pb-4 relative z-20 overflow-x-auto hide-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto flex gap-3 pb-2 w-max">
          <QuickPrompt icon={<Utensils size={14}/>} text="Mess Menu" onClick={() => handleSend("What's in the mess today?")} />
          <QuickPrompt icon={<Wifi size={14}/>} text="Wi-Fi Issue" onClick={() => handleSend("Wi-Fi isn't working")} />
          <QuickPrompt icon={<Clock size={14}/>} text="Outpass Rules" onClick={() => handleSend("How to get an outpass?")} />
          <QuickPrompt icon={<Wrench size={14}/>} text="Maintenance" onClick={() => handleSend("Report broken fan")} />
          <QuickPrompt icon={<BookOpen size={14}/>} text="Library Timings" onClick={() => handleSend("Library timings")} />
          <QuickPrompt icon={<Search size={14}/>} text="Lost & Found" onClick={() => handleSend("Lost and found")} />
          <QuickPrompt icon={<Moon size={14}/>} text="Curfew Rules" onClick={() => handleSend("Hostel curfew time")} />
          <QuickPrompt icon={<Briefcase size={14}/>} text="Warden Office" onClick={() => handleSend("Warden office hours")} />
        </div>
      </div>

      {/* ─── INPUT AREA ─── */}
      <div className="p-6 md:px-10 md:py-6 relative z-20 bg-white/90 backdrop-blur-xl border-t border-sky-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            placeholder={isTyping ? "AI is typing..." : "Type your campus query here..."} 
            className="w-full bg-slate-50 border-2 border-slate-100 text-slate-700 placeholder-slate-400 px-6 py-4 rounded-full outline-none focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium pr-16 shadow-inner disabled:opacity-50"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 rounded-full flex items-center justify-center text-white transition-colors shadow-md disabled:shadow-none active:scale-95"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          StayPG AI can make mistakes. Check with the Rector for official notices.
        </p>
      </div>

      {/* Custom Scrollbar CSS hiding specifically for the prompts container */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function QuickPrompt({ icon, text, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-white border border-sky-100 hover:border-sky-300 hover:bg-sky-50 text-slate-600 hover:text-sky-600 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95">
      <span className="text-sky-500">{icon}</span> {text}
    </button>
  );
}