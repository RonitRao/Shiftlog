// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer"; 
import { 
  Shield, 
  ScanLine, 
  BarChart3, 
  BrainCircuit, 
  Lock, 
  ArrowRight, 
  LogOut, 
  Star, 
  CheckCircle2, 
  Layers,
  Sparkles,
  FileText
} from "lucide-react";

// --- CUSTOM SCROLL REVEAL COMPONENT ---
// This observes when an element enters the viewport and triggers a smooth fade-up.
const ScrollReveal = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          // Stop observing once it's visible so it doesn't fade out and in repeatedly
          observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.15 } // Triggers when 15% of the section is visible on screen
    );
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`w-full transition-all duration-[1200ms] ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      {children}
    </div>
  );
};

export default function LandingPage({ session }) {

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Sign-out request execution anomaly:", err);
    }
  };

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen bg-[#020205] text-zinc-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black overflow-x-hidden font-sans relative">
      
      {/* ADVANCED KINETIC BACKGROUND ANIMATION & GLASS SHINE KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatSweep1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(150px, -100px) scale(1.2); }
          66% { transform: translate(-100px, 150px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatSweep2 {
          0% { transform: translate(0, 0) scale(1.2); }
          33% { transform: translate(-150px, 100px) scale(0.9); }
          66% { transform: translate(120px, -80px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1.2); }
        }
        @keyframes floatSweep3 {
          0% { transform: translate(0, 0) scale(0.8); }
          33% { transform: translate(80px, 150px) scale(1.3); }
          66% { transform: translate(-120px, -100px) scale(1.0); }
          100% { transform: translate(0, 0) scale(0.8); }
        }
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes glassShine {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          20% { opacity: 0.3; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }
      `}} />

      {/* FIXED SILKY BACKGROUND MESH */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#020205]" />
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[130px] animate-[floatSweep1_25s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-cyan-900/20 rounded-full blur-[120px] animate-[floatSweep2_30s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[1000px] h-[1000px] bg-blue-900/25 rounded-full blur-[150px] animate-[floatSweep3_35s_ease-in-out_infinite]" />
      </div>

      {/* STICKY GLASS HEADER */}
      <header className="fixed top-0 left-0 w-full h-20 flex items-center justify-between border-b border-white/5 bg-zinc-950/40 backdrop-blur-xl z-50 px-6 lg:px-10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)]">
              <Shield className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ShiftLog<span className="text-cyan-400 font-mono text-xs ml-0.5">Hub</span></span>
          </div>
          
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateTo("/dashboard")}
                  className="h-9 px-4 font-bold border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white rounded-xl transition-all"
                >
                  Go to Console
                </Button>
                <button 
                  onClick={handleSignOut}
                  className="h-9 px-4 text-xs font-bold font-mono uppercase tracking-wider rounded-xl bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigateTo("/login")}
                  className="h-9 px-4 font-bold text-zinc-400 hover:text-white rounded-xl"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigateTo("/signup")}
                  className="h-9 px-5 font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="w-full relative z-10 flex flex-col items-center pt-20">
        
        {/* HERO SECTION */}
        <ScrollReveal>
          <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20 lg:py-28">
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-medium tracking-wide w-fit font-mono shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Next-Gen Freight Automation Live
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                Intelligent Fleet <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Operations Management
                </span>
              </h1>
              <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed font-sans">
                Deploy automated visual auditing pipelines, execute smart log manifest checks, and sync real-time cargo intelligence across one unified cloud terminal interface.
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                <Button 
                  className="group h-12 px-6 font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 shadow-xl shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer" 
                  onClick={() => navigateTo(session ? "/dashboard" : "/signup")}
                >
                  {session ? "Enter System Console" : "Start Your Free Run"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative w-full flex items-center justify-center">
              <div className="w-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-[0_30px_70px_rgba(0,0,0,0.5)] space-y-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-[10px] font-mono text-zinc-300 tracking-widest uppercase font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" /> Operational Overview
                  </span>
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                </div>

                <div className="space-y-3 font-sans">
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-4 shadow-inner">
                    <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
                      <ScanLine className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">AI Visual Verification</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Automated image manifest validation layer clear.</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.2)]">PASS</span>
                  </div>

                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-4 shadow-inner">
                    <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">Dynamic Matrix Tracking</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Logbook performance charts synced in real-time.</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 rounded-md shadow-[0_0_10px_rgba(6,182,212,0.2)]">SYNCED</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FEATURES MATRIX SECTION */}
        <ScrollReveal>
          <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900/60 relative">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              
              <h2 className="relative inline-block text-3xl md:text-4xl font-black tracking-tight cursor-default group">
                <span className="text-white transition-opacity duration-700 ease-in-out group-hover:opacity-0">Everything required to master fleet logistics</span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" aria-hidden="true">Everything required to master fleet logistics</span>
              </h2>

              <p className="text-sm text-zinc-400 font-sans">
                Engineered specifically to transform raw transport schedules into secure, AI-powered corporate assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/60 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group relative">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-4 transition-all group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <ScanLine className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 font-sans">AI Vision Log Scanner</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Drop in raw vehicle manifests to let custom models audit text fields and compliance parameters.
                </p>
              </div>

              <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/60 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group relative">
                <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center mb-4 transition-all group-hover:border-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 font-sans">Dynamic Analytics Matrix</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Visualize terminal workloads and fleet performance distributions across highly interactive UI charts.
                </p>
              </div>

              <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/60 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group relative">
                <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mb-4 transition-all group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <BrainCircuit className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 font-sans">AI Fleet Diagnostics</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Receive proactive warning vectors, smart routing recommendations, and automated metric analysis.
                </p>
              </div>

              <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/60 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mb-4 transition-all group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 font-sans">Isolated Guard Safeguards</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Keep client freight entries fully air-gapped using absolute Supabase Row-Level Security policies.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* AI SCANNER ADVERTISEMENT SECTION */}
        <ScrollReveal>
          <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900/60 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <div className="relative w-full aspect-square max-h-[450px] bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800/80 overflow-hidden flex items-center justify-center shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="w-[60%] h-[75%] bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden p-6 flex flex-col gap-5 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                    <FileText className="w-6 h-6 text-zinc-500" />
                    <div className="w-1/2 h-3 bg-zinc-800 rounded-full" />
                  </div>
                  <div className="w-full h-2 bg-zinc-800/60 rounded-full" />
                  <div className="w-5/6 h-2 bg-zinc-800/60 rounded-full" />
                  <div className="w-full h-2 bg-zinc-800/60 rounded-full" />
                  <div className="w-2/3 h-2 bg-zinc-800/60 rounded-full" />
                  
                  <div className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee,0_0_40px_#22d3ee] animate-[scanline_2.5s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/30 text-purple-400 text-xs font-bold tracking-wide font-mono">
                  CORE FEATURE
                </div>

                <h2 className="relative inline-block text-4xl md:text-5xl font-black tracking-tight leading-[1.1] cursor-default group">
                  <span className="text-white transition-opacity duration-700 ease-in-out group-hover:opacity-0">Turn Raw Manifests Into Actionable Intelligence.</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" aria-hidden="true">Turn Raw Manifests Into Actionable Intelligence.</span>
                </h2>

                <p className="text-zinc-400 text-lg leading-relaxed font-sans">
                  Eliminate manual data entry entirely. Our purpose-built AI Vision Scanner instantly extracts odometers, load weights, and compliance signatures from any document upload.
                </p>
                
                <div className="space-y-5 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <ScanLine className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Dynamic Data Extraction</h4>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Advanced parsing algorithms pull precise metrics from blurry or unstructured shift sheets instantly.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Automated Verification</h4>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Extracted parameters are cross-referenced with your secure database rules to flag compliance anomalies.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Dashboard Sync</h4>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Verified logs bypass the backlog and are pushed directly to your matrix, generating real-time performance charts.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </ScrollReveal>

        {/* TESTIMONIALS SECTION */}
        <ScrollReveal>
          <section className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900/60 relative">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              
              <h2 className="relative inline-block text-3xl md:text-4xl font-black tracking-tight cursor-default group">
                <span className="text-white transition-opacity duration-700 ease-in-out group-hover:opacity-0">Validated by freight operations specialists</span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" aria-hidden="true">Validated by freight operations specialists</span>
              </h2>

              <p className="text-sm text-zinc-400 font-sans">
                See how corporate transport managers use ShiftLog to optimize compliance across logistics terminals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/60 p-8 rounded-2xl flex flex-col justify-between shadow-lg relative group hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans italic">
                    "ShiftLog completely automated our manual line-haul sheet audits. The AI log scanner cut our compliance verification review time down significantly."
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Anand Deshmukh</p>
                    <p className="text-[11px] font-mono text-cyan-400 mt-1">VP of Operations, Maharashtra Cargo Corp</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>
              </div>

              <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/60 p-8 rounded-2xl flex flex-col justify-between shadow-lg relative group hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans italic">
                    "Having our live driver shift configurations side-by-side with automated database audit logs makes managing cross-state distribution entirely stress-free."
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Karan Malhotra</p>
                    <p className="text-[11px] font-mono text-cyan-400 mt-1">Terminal Supply Director, InterState Logistics</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>
              </div>

              <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/60 p-8 rounded-2xl flex flex-col justify-between shadow-lg relative group hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans italic">
                    "The isolated client-side encryption and strict Row-Level database security give our enterprise transport clients total peace of mind."
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Meera Nair</p>
                    <p className="text-[11px] font-mono text-cyan-400 mt-1">Senior Security Auditor, FreightGuard Systems</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>
              </div>

            </div>
          </section>
        </ScrollReveal>

        {/* CALL TO ACTION PANEL SECTION */}
        <ScrollReveal>
          <section className="w-full max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
            <div className="group bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-10 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-8 relative overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-[0_30px_80px_rgba(6,182,212,0.15)] cursor-default">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              {/* Animated Shine Element */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-[glassShine_1.5s_ease-in-out_forwards]" />
              
              <div className="space-y-4 relative z-10">
                
                <h2 className="relative inline-block text-4xl md:text-5xl font-black tracking-tight cursor-default">
                  <span className="text-white transition-opacity duration-700 ease-in-out group-hover:opacity-0">Start your journey with us!</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" aria-hidden="true">Start your journey with us!</span>
                </h2>

                <p className="text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
                  Let's start an easier way to manage your fleet. Join operators nationwide running clean logbook metrics and secure visual manifest parsing.
                </p>
              </div>
              
              <div className="pt-4 relative z-10">
                <Button 
                  onClick={() => navigateTo(session ? "/dashboard" : "/signup")}
                  className="h-14 px-10 font-bold text-sm tracking-wide rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] cursor-pointer hover:scale-105 relative z-20"
                >
                  Get Started Today!
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>

      </main>

      <Footer />
      
    </div>
  );
}