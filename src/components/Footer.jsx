// src/components/Footer.jsx
import React from "react";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950/40 backdrop-blur-xl relative z-20 overflow-hidden shadow-[0_-4px_30px_rgba(0,0,0,0.1)] px-6 lg:px-10">
      
      {/* PERFECTED SMOOTH DEEP PINK NEON GLOW TRACKING KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes neonPinkGlow {
          0%, 100% { 
            text-shadow: 0 0 6px rgba(237, 24, 194, 0.4), 0 0 16px rgba(237, 24, 194, 0.2); 
            color: #ed18c2; 
          }
          50% { 
            text-shadow: 0 0 14px rgba(237, 24, 194, 0.8), 0 0 28px rgba(237, 24, 194, 0.5); 
            color: #fb7185; 
          }
        }
        .animate-neon-pink-glow { animation: neonPinkGlow 3.5s ease-in-out infinite; }
      `}} />
      
      <div className="max-w-7xl mx-auto h-24 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
        
        {/* LEFT COMPONENT LAYER: PREMIUM LOGO CONFIG & HUMANIZED COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Exactly matches the top navigation header's gradient design asset */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Shield className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              ShiftLog<span className="text-cyan-400 font-mono text-xs ml-0.5">Hub</span>
            </span>
          </div>
          
          {/* Vertical Separator Node */}
          <div className="hidden sm:block w-px h-5 bg-zinc-800/80" />
          
          <span className="text-[11px] sm:text-xs text-zinc-400 font-mono tracking-wide text-center sm:text-left">
            &copy; 2026 ShiftLog Framework Core. All rights reserved.
          </span>
        </div>

        {/* RIGHT COMPONENT LAYER: IMMERSIVE PINK GLOWING DIAGNOSTIC TRACE */}
        <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-black font-mono text-center sm:text-right animate-neon-pink-glow">
          System Deployment Link // Production Hardened Secure
        </div>
      </div>
    </footer>
  );
}