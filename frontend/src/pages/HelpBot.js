import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, Sparkles, Bot, User, Clock, Utensils,
  Wrench, Wifi, BookOpen, Search, Moon, Briefcase, Trash2, Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// System context about SGGSIE&T for the AI
const SYSTEM_PROMPT = `You are the StayPG AI Concierge — an intelligent hostel assistant for SGGSIE&T (Shri Guru Gobind Singhji Institute of Engineering and Technology), Vishnupuri, Nanded, Maharashtra.

You help students, staff, and guests with questions about:
- Hostel facilities: Sahyadri Boys Hostel (8 rooms: AC rooms A4, A10, B4, B10; Non-AC rooms A8, A9, B8, B9) and Krishna Girls Hostel (Non-AC rooms A9, A10)
- Room booking via SBI Collect, DU Reference Numbers, Rector approval process
- Mess/dining schedules: Breakfast 7:30-9 AM, Lunch 12:30-2 PM, Dinner 8-10 PM
- Outpass/gate pass procedures — require Warden approval
- Maintenance ticket system via dashboard
- Campus facilities: Library (8 AM–12 midnight, 24/7 during exams), Gym (6–8 AM & 5–8 PM), Campus Wi-Fi (SGGSIE&T-Net)
- Hostel curfew: 10:30 PM
- SOS/emergency: Campus Security +91 02462-229234
- Rector's office hours: 4–6 PM weekdays
- Payment: ₹450/day via SBI Collect portal

Be concise, friendly, and helpful. Always respond in English. Keep responses under 4 sentences unless step-by-step instructions are needed. Never make up information about specific people or policies you don't know.`;

export default function HelpBot() {
  const navigate = useNavigate();
  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your StayPG AI Concierge. I can help with mess menus, outpasses, room bookings, maintenance, campus rules, and more. What can I help you with?",
      sender: "bot",
      time: getCurrentTime()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleClearChat = () => {
    setMessages([{ text: "Chat cleared. How can I help you from scratch?", sender: "bot", time: getCurrentTime() }]);
    setConversationHistory([]);
  };

  const callClaudeAPI = async (userMessage, history) => {
    const updatedHistory = [...history, { role: "user", content: userMessage }];
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updatedHistory,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I couldn't get a response. Please try again.";
      return { reply, updatedHistory: [...updatedHistory, { role: "assistant", content: reply }] };
    } catch (err) {
      console.error("Claude API error:", err);
      // Fallback to local responses if API fails
      return { reply: getFallbackResponse(userMessage), updatedHistory };
    }
  };

  // Fallback responses if API is unavailable
  const getFallbackResponse = (text) => {
    const t = text.toLowerCase();
    if (t.match(/\b(hi|hello|hey|namaste)\b/)) return "Hello! I'm your StayPG AI Concierge. How can I help you today?";
    if (t.match(/\b(mess|food|dinner|lunch|menu|eat|breakfast)\b/)) return "Today's mess schedule:\n• Breakfast: 7:30–9:00 AM\n• Lunch: 12:30–2:00 PM\n• Dinner: 8:00–10:00 PM\n\nYou can skip dinner from your Dashboard → Dining Hub.";
    if (t.match(/\b(outpass|leave|gate pass)\b/)) return "You can generate a Smart Gate Pass from your Dashboard under Quick Actions. It requires Warden approval (usually 1–2 hours). Valid until 10:30 PM.";
    if (t.match(/\b(repair|broken|maintenance|plumb|electric)\b/)) return "Raise a Maintenance Ticket from your Dashboard. Choose a category (Electrical, Plumbing, etc.) and a technician is assigned within 24 hours.";
    if (t.match(/\b(fee|pay|sbi|receipt|du number|booking)\b/)) return "Pay via SBI Collect, then submit your DU Reference Number and receipt at 'Verify Pass' on your Dashboard. The Rector will review and approve your room within a few hours.";
    if (t.match(/\b(wifi|internet|network)\b/)) return "Register your MAC address on the SGGSIE&T IT portal for campus Wi-Fi. For issues, visit the CCF center (1st floor) during college hours.";
    if (t.match(/\b(library|study|books)\b/)) return "Central Library hours: 8 AM–12 midnight on regular days, 24/7 during exam weeks.";
    if (t.match(/\b(curfew|entry|close|late)\b/)) return "Hostel curfew is 10:30 PM sharp. Inform your Block Warden in advance if arriving late due to transport delays.";
    if (t.match(/\b(emergency|sos|medical|fire|police)\b/)) return "🚨 Use the SOS button on your Dashboard for emergencies, or call Campus Security: +91 02462-229234.";
    return "I'm here to help with hostel queries. Try asking about mess timings, room booking, outpass, maintenance, or campus facilities.";
  };

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { text, sender: "user", time: getCurrentTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const { reply, updatedHistory } = await callClaudeAPI(text, conversationHistory);
    setConversationHistory(updatedHistory);
    setMessages(prev => [...prev, { text: reply, sender: "bot", time: getCurrentTime() }]);
    setIsTyping(false);
  };

  const QUICK_PROMPTS = [
    { icon: <Utensils size={13} />, text: "Mess Menu Today" },
    { icon: <Wifi size={13} />, text: "Wi-Fi Issue" },
    { icon: <Clock size={13} />, text: "Outpass Rules" },
    { icon: <Wrench size={13} />, text: "Report Maintenance" },
    { icon: <BookOpen size={13} />, text: "Library Hours" },
    { icon: <Search size={13} />, text: "Lost & Found" },
    { icon: <Moon size={13} />, text: "Curfew Rules" },
    { icon: <Briefcase size={13} />, text: "Warden Contact" },
    { icon: <Zap size={13} />, text: "Room Booking Help" },
  ];

  return (
    <div className="h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden text-slate-800">

      {/* ─── HEADER ─── */}
      <header className="z-20 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="w-10 h-10 bg-slate-50 border border-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 rounded-xl flex items-center justify-center text-slate-500 transition-colors shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 flex items-center gap-2 leading-none">
                <Sparkles className="text-amber-500" size={17} /> StayPG AI Concierge
              </h1>
              <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> AI Online · Powered by Claude
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
              <Sparkles size={12} className="text-amber-500" />
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Contextual AI</span>
            </div>
            <button onClick={handleClearChat} title="Clear Chat"
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-slate-100">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── CHAT AREA ─── */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-5">
        <div className="max-w-3xl mx-auto space-y-5">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={i}
                className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-200 flex-shrink-0 mb-1">
                    <Bot size={18} />
                  </div>
                )}
                <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-xs md:max-w-lg p-4 text-sm font-medium leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-sky-500 text-white rounded-[1.5rem] rounded-br-md shadow-md shadow-sky-500/20"
                      : "bg-white border border-slate-100 text-slate-700 rounded-[1.5rem] rounded-bl-md shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-sm border border-slate-700 flex-shrink-0 mb-1">
                    <User size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* TYPING INDICATOR */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3 justify-start">
              <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-200 flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-slate-100 text-slate-700 rounded-[1.5rem] rounded-bl-md shadow-sm px-5 py-4 flex gap-1.5 items-center">
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-sky-400 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-2 h-2 bg-sky-400 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-2 h-2 bg-sky-400 rounded-full" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ─── QUICK PROMPTS ─── */}
      <div className="px-5 md:px-8 pb-3 overflow-x-auto hide-scrollbar flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2 pb-1 w-max">
          {QUICK_PROMPTS.map(({ icon, text }) => (
            <button key={text} onClick={() => handleSend(text)} disabled={isTyping}
              className="flex items-center gap-2 bg-white border border-slate-100 hover:border-sky-200 hover:bg-sky-50 text-slate-600 hover:text-sky-600 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 disabled:opacity-50">
              <span className="text-sky-500">{icon}</span> {text}
            </button>
          ))}
        </div>
      </div>

      {/* ─── INPUT AREA ─── */}
      <div className="px-5 md:px-8 py-4 bg-white border-t border-slate-100 shadow-sm flex-shrink-0">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
            placeholder={isTyping ? "AI is thinking..." : "Ask anything about StayPG..."}
            className="w-full bg-slate-50 border-2 border-slate-100 text-slate-700 placeholder-slate-400 px-5 py-3.5 rounded-2xl outline-none focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium pr-14 disabled:opacity-50" />
          <button onClick={() => handleSend()} disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 rounded-xl flex items-center justify-center text-white transition-all shadow-md disabled:shadow-none active:scale-95">
            <Send size={16} className="ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-3">
          AI responses may not reflect latest policy changes — always verify with Rector's Office.
        </p>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}