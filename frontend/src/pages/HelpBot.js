import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, Sparkles, Bot, User, Utensils,
  Wrench, Wifi, BookOpen, Search, Moon, Briefcase,
  Trash2, Zap, Clock, Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";

const SYSTEM_PROMPT = `You are the StayPG AI Concierge — an intelligent, friendly hostel assistant for SGGSIE&T (Shri Guru Gobind Singhji Institute of Engineering and Technology), Vishnupuri, Nanded, Maharashtra, India.

You assist with:
- Hostel facilities: Sahyadri Boys Hostel (8 rooms: AC rooms A4, A10, B4, B10 at ₹550/day; Non-AC rooms A8, A9, B8, B9 at ₹450/day) and Krishna Girls Hostel (Non-AC rooms A9, A10 at ₹450/day).
- Room booking via SBI Collect portal, DU Reference Numbers, Rector approval process.
- Mess schedule: Breakfast 7:30–9:00 AM, Lunch 12:30–2:00 PM, Dinner 8:00–10:00 PM.
- Smart Outpass / Gate Pass — requires Warden approval, curfew 10:30 PM.
- Maintenance tickets — raise via dashboard, resolved within 24 hours.
- Campus Wi-Fi: SGGSIE&T-Net — register MAC address on IT portal.
- Library: 8 AM–12 midnight regular days, 24/7 during exams.
- Gym: 6–8 AM and 5–8 PM.
- Emergency: Campus Security +91 02462-229234.
- Rector office hours: 4–6 PM weekdays.
- Check-in timer: starts after guard scans QR at main gate. Timer is exactly 24 hours.

Be friendly, concise, respond in English. Max 4 sentences unless step-by-step. Never fabricate.`;

const getFallback = (text) => {
  const t = text.toLowerCase();
  if (t.match(/\b(hi|hello|hey|namaste)\b/)) return "Hello! I'm your StayPG AI Concierge for SGGSIE&T. How can I help you today?";
  if (t.match(/\b(mess|food|dinner|lunch|menu|eat|breakfast)\b/)) return "Today's schedule:\n• Breakfast: 7:30–9:00 AM\n• Lunch: 12:30–2:00 PM\n• Dinner: 8:00–10:00 PM\n\nSkip a meal from Dashboard → Dining Hub.";
  if (t.match(/\b(outpass|leave|gate.?pass|going out)\b/)) return "Generate a Smart Gate Pass from Dashboard → Quick Actions. Requires Warden approval (1–2 hours). Curfew is 10:30 PM.";
  if (t.match(/\b(repair|broken|fan|water|plumb|electric|maintenance)\b/)) return "Raise a Maintenance Ticket from your Dashboard. Select category and a technician will be assigned within 24 hours.";
  if (t.match(/\b(fee|pay|sbi|receipt|du.?number|booking|payment)\b/)) return "Pay via SBI Collect, then submit DU Reference Number + receipt at StayPG → Verify Pass. Rector reviews and approves within a few hours.";
  if (t.match(/\b(wifi|wi.?fi|internet|network)\b/)) return "Register your MAC address on the SGGSIE&T IT portal. For issues, visit CCF center (1st floor) during college hours.";
  if (t.match(/\b(library|study|books|reading)\b/)) return "Library hours: 8 AM–12 midnight on regular days, 24/7 during exam weeks.";
  if (t.match(/\b(curfew|timing|close|late)\b/)) return "Hostel curfew is 10:30 PM. Inform your Block Warden in advance for late arrivals due to transport delays.";
  if (t.match(/\b(emergency|sos|medical|fire|police|ambulance)\b/)) return "🚨 Use the red SOS button on your Dashboard or call Campus Security: +91 02462-229234 immediately.";
  if (t.match(/\b(rector|warden|office|complaint)\b/)) return "Rector's office: Ground floor, Sahyadri Block A. Query hours: 4:00–6:00 PM weekdays.";
  if (t.match(/\b(gym|exercise|fitness)\b/)) return "Campus gym is open 6–8 AM and 5–8 PM daily, near Sahyadri Boys Hostel block.";
  if (t.match(/\b(room|book|available|vacancy|hostel|price|cost)\b/)) return "Sahyadri Boys: AC (A4,A10,B4,B10) ₹550/day · Non-AC (A8,A9,B8,B9) ₹450/day\nKrishna Girls: Non-AC (A9,A10) ₹450/day\n\nBook via Explore Hostels on dashboard.";
  if (t.match(/\b(timer|check.?in|checkout|24.?hour)\b/)) return "Your 24-hour stay timer starts when the campus guard scans your QR Gate Pass at main gate. Both you and the Rector can see the live countdown.";
  if (t.match(/\b(thanks|thank|bye|good|awesome|great)\b/)) return "You're welcome! I'm available 24/7 for any campus queries. Have a great day! 😊";
  return "I'm here to help with SGGSIE&T hostel! Ask about mess timings, room booking, outpass, maintenance, Wi-Fi, or any campus facility.";
};

export default function HelpBot() {
  const navigate = useNavigate();
  const getTime  = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState([{
    text: "Hello! I'm your StayPG AI Concierge powered by Claude. I can help with mess menus, room bookings, outpass rules, maintenance, campus facilities, and more. What can I help you with?",
    sender: "bot",
    time: getTime()
  }]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const clearChat = () => {
    setMessages([{ text: "Chat cleared! How can I help you from scratch?", sender: "bot", time: getTime() }]);
    setHistory([]);
  };

  const callClaude = async (userMsg, curHistory) => {
    const updated = [...curHistory, { role: "user", content: userMsg }];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updated,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data  = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "I couldn't respond right now. Please try again.";
      return { reply, newHistory: [...updated, { role: "assistant", content: reply }] };
    } catch {
      return { reply: getFallback(userMsg), newHistory: updated };
    }
  };

  const handleSend = async (text = input) => {
    const msg = text.trim();
    if (!msg || typing) return;
    setMessages(prev => [...prev, { text: msg, sender: "user", time: getTime() }]);
    setInput("");
    setTyping(true);
    const { reply, newHistory } = await callClaude(msg, history);
    setHistory(newHistory);
    setMessages(prev => [...prev, { text: reply, sender: "bot", time: getTime() }]);
    setTyping(false);
  };

  const QUICK_PROMPTS = [
    { icon: <Utensils size={13}/>,  text: "Mess Menu Today"     },
    { icon: <Wifi size={13}/>,      text: "Wi-Fi Setup Help"    },
    { icon: <Clock size={13}/>,     text: "Outpass Rules"       },
    { icon: <Wrench size={13}/>,    text: "Report Maintenance"  },
    { icon: <BookOpen size={13}/>,  text: "Library Hours"       },
    { icon: <Search size={13}/>,    text: "Lost & Found"        },
    { icon: <Moon size={13}/>,      text: "Curfew Timings"      },
    { icon: <Briefcase size={13}/>, text: "Warden Contact"      },
    { icon: <Zap size={13}/>,       text: "Room Booking Help"   },
    { icon: <Shield size={13}/>,    text: "SOS / Emergency"     },
  ];

  return (
    <div className="h-screen bg-slate-50 font-sans flex flex-col text-slate-800 overflow-hidden">

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 sm:px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 bg-slate-50 border border-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 rounded-xl flex items-center justify-center text-slate-500 transition-all shadow-sm flex-shrink-0">
            <ArrowLeft size={18}/>
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 flex items-center gap-2 leading-none">
              <Sparkles className="text-amber-500 flex-shrink-0" size={16}/> StayPG AI Concierge
            </h1>
            <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
              AI Online · Powered by Claude
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
            <Sparkles size={11} className="text-amber-500"/>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Contextual AI</span>
          </div>
          <button onClick={clearChat} title="Clear Chat"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-slate-100">
            <Trash2 size={16}/>
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-5">
        <div className="max-w-3xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" && (
                  <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-200 flex-shrink-0 mb-1">
                    <Bot size={17}/>
                  </div>
                )}
                <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[280px] sm:max-w-md px-4 py-3.5 text-sm font-medium leading-relaxed whitespace-pre-line rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-sky-500 text-white rounded-br-sm shadow-md shadow-sky-500/20"
                      : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-sm"
                  }`}>{msg.text}</div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-sm border border-slate-700 flex-shrink-0 mb-1">
                    <User size={16}/>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3 justify-start">
              <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-200 flex-shrink-0">
                <Bot size={17}/>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm px-5 py-4 flex gap-1.5 items-center">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay }}
                    className="w-2 h-2 bg-sky-400 rounded-full"/>
                ))}
              </div>
            </motion.div>
          )}
          <div ref={endRef}/>
        </div>
      </div>

      {/* QUICK PROMPTS */}
      <div className="px-4 sm:px-5 pb-2 overflow-x-auto flex-shrink-0 hide-scrollbar">
        <div className="max-w-3xl mx-auto flex gap-2 pb-1 w-max">
          {QUICK_PROMPTS.map(({ icon, text }) => (
            <button key={text} onClick={() => handleSend(text)} disabled={typing}
              className="flex items-center gap-2 bg-white border border-slate-100 hover:border-sky-200 hover:bg-sky-50 text-slate-600 hover:text-sky-600 px-3.5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 disabled:opacity-50">
              <span className="text-sky-500">{icon}</span> {text}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT */}
      <div className="px-4 sm:px-5 py-4 bg-white border-t border-slate-100 flex-shrink-0 pb-20 lg:pb-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()} disabled={typing}
            placeholder={typing ? "AI is thinking..." : "Ask anything about SGGSIE&T hostel..."}
            className="flex-1 bg-slate-50 border-2 border-slate-100 text-slate-700 placeholder-slate-400 px-5 py-3.5 rounded-2xl outline-none focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium text-sm disabled:opacity-50"/>
          <button onClick={() => handleSend()} disabled={!input.trim() || typing}
            className="w-11 h-11 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 rounded-xl flex items-center justify-center text-white transition-all shadow-md disabled:shadow-none active:scale-95 flex-shrink-0">
            <Send size={16} className="ml-0.5"/>
          </button>
        </div>
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-3">
          AI responses may not reflect latest policy changes — verify with Rector's Office.
        </p>
      </div>

      <MobileNav/>
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}