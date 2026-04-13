import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Building2, CalendarCheck, User, Bot } from "lucide-react";

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path     = location.pathname;

  const tabs = [
    { icon: Home,          label: "Home",     route: "/dashboard"       },
    { icon: Building2,     label: "Hostels",  route: "/home"            },
    { icon: CalendarCheck, label: "Bookings", route: "/my-bookings"     },
    { icon: Bot,           label: "AI",       route: "/helpbot"         },
    { icon: User,          label: "Profile",  route: "/complete-profile"},
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-stretch h-16">
        {tabs.map(({ icon: Icon, label, route }) => {
          const active = path === route || (route === "/dashboard" && path === "/");
          return (
            <button
              key={route}
              onClick={() => navigate(route)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all ${
                active ? "text-sky-500" : "text-slate-400"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-sky-50" : ""}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${active ? "text-sky-500" : "text-slate-400"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}