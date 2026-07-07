import React from "react";
import { Shield } from "lucide-react";

export default function LoadingScreen({ message = "Synchronizing Matrix Layers" }) {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center relative overflow-hidden font-sans">
      {/* 🚀 Dynamic Background Blinds Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(230deg, #660bea 0%, #0200fb 50%, #09090b 100%)" }} />
      </div>

      {/* Ambient Backdrop Blur Orb */}
      <div className="absolute w-[350px] h-[350px] bg-cyan-500/[0.04] rounded-full filter blur-[80px] animate-pulse" />

      {/* 💎 Premium Glassmorphic Loading Card */}
      <div className="w-full max-w-sm p-8 bg-[#11052a]/30 rounded-2xl border border-zinc-800/60 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        
        {/* Kinetic Tech Scanning Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_2s_linear_infinite]" />

        {/* Pulsing Logo Container */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative group animate-[pulseGlow_2.5s_ease-in-out_infinite]">
          <Shield className="w-7 h-7 text-zinc-950 stroke-[2.5]" />
          {/* Subtle outer echo ring */}
          <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 scale-110 animate-ping opacity-25" style={{ animationDuration: '3s' }} />
        </div>

        {/* Text Stack */}
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
            System Initialization
          </p>
          <p className="text-sm font-medium text-zinc-400 animate-pulse font-mono tracking-tight">
            {message}...
          </p>
        </div>

        {/* High-Fidelity Modern Line Progress Bar */}
        <div className="w-40 h-[3px] bg-zinc-900 rounded-full relative overflow-hidden border border-zinc-800/40">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-[progress_1.8s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
        @keyframes progress {
          0% { left: -40%; width: 40%; }
          50% { width: 60%; }
          100% { left: 100%; width: 20%; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); shadow: 0 10px 15px -3px rgba(6,182,212,0.2); }
          50% { transform: scale(1.04); shadow: 0 20px 25px -5px rgba(6,182,212,0.4); }
        }
      `}} />
    </div>
  );
}