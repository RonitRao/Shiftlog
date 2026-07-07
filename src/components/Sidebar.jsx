import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield, LogOut, LayoutDashboard, ClipboardList, Sparkles, User, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Sidebar({ activePage, userEmail }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navItems = [
    { id: "dashboard", path: "/dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
    { id: "logs", path: "/logs", icon: ClipboardList, label: "Logbook Matrix" },
    { id: "ai-scanner", path: "/scanner", icon: Sparkles, label: "AI Fleet Inspector" },
    { id: "profile", path: "/profile", icon: User, label: "Operator Account" }
  ];

  return (
    <aside className="w-64 bg-[#0e0624]/90 backdrop-blur-2xl border-r border-zinc-800/40 p-6 flex flex-col justify-between shrink-0 h-screen fixed left-0 top-0 overflow-hidden z-50">
      {/* Subtle Sidebar Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-cyan-500/5 blur-[50px] pointer-events-none" />

      <div className="space-y-8 relative z-10">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-300">ShiftLog</span>
        </Link>

        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-1">Navigation</div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.id}
                to={item.path} 
                className={`group relative w-full h-11 px-3 rounded-xl flex items-center justify-between text-sm font-medium overflow-hidden transition-all duration-300 ${
                  isActive ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {/* Animated Hover Background Slide */}
                <div className={`absolute inset-0 transition-transform duration-300 ease-out ${
                  isActive ? "bg-cyan-950/40 border border-cyan-500/20 translate-x-0" : "bg-zinc-900/40 border border-zinc-800/50 -translate-x-full group-hover:translate-x-0"
                } rounded-xl pointer-events-none`} />

                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span>{item.label}</span>
                </div>
                
                {/* Active Indicator Dot */}
                <div className="relative z-10 flex items-center">
                  <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"}`} />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-zinc-800/60 flex flex-col gap-4 relative z-10">
        <div className="truncate px-2 p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-0.5">Active Operator</p>
          <p className="text-xs font-bold text-zinc-200 truncate">{userEmail}</p>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-950/20 group transition-all" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Sign Out
        </Button>
      </div>
    </aside>
  )
}