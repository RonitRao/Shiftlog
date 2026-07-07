import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState(window.location.pathname === "/signup" ? "signup" : "signin");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      setAuthMode(window.location.pathname === "/signup" ? "signup" : "signin");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setAuthMode(path === "/signup" ? "signup" : "signin");
    
    setEmail("");
    setPassword("");
    setFullName("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setSuccessMessage("Registration successful! You can now sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMessage(err.message || "Failed to initialize Google OAuth session.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* 🚀 HIGH-FIDELITY GRADIENT BLINDS & DYNAMIC SPOTLIGHT LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core Base Color Mapping Canvas */}
        <div className="absolute inset-0 bg-[#09090b]" />

        {/* Core Linear Angular Gradient Canvas matching angle=230 */}
        <div 
          className="absolute inset-0 opacity-45 mix-blend-screen"
          style={{
            background: "linear-gradient(230deg, #660bea 0%, #0200fb 50%, #09090b 100%)"
          }}
        />

        {/* Dynamic Blind Slats Grid Structure (blindMinWidth=10px) */}
        <div className="absolute inset-0 flex justify-between opacity-20 filter blur-[1px]">
          {[...Array(32)].map((_, i) => (
            <div
              key={i}
              className="h-full bg-zinc-950 transition-all duration-[3000ms] ease-in-out animate-pulse"
              style={{
                width: `${10 + (i % 3) * 5}px`,
                minWidth: "10px",
                animationDuration: `${4 + (i % 4) * 2}s`,
                animationDelay: `${i * 0.12}s`,
                transform: "rotate(-10deg) scaleY(1.2)"
              }}
            />
          ))}
        </div>

        {/* 🛠️ INJECTED: CINEMATIC KINETIC SPOTLIGHT SWEEP OVERLAY (spotlightRadius=0.65) */}
        <div 
          className="absolute inset-0 mix-blend-multiply animate-[spotlight_12s_ease-in-out_infinite_alternate]"
          style={{
            background: "radial-gradient(circle 65% at var(--spotlight-x, 30%) var(--spotlight-y, 40%), transparent 10%, #09090b 95%)"
          }}
        />

        {/* 🛠️ INJECTED: DEEP BLACK SMOOTH BLUR RESPONSIVE MASKS FOR CONTRAST DEPTH */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,transparent_30%,#09090b_90%)] opacity-60 mix-blend-normal" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,transparent_40%,#09090b_95%)] opacity-50 mix-blend-normal" />

        {/* Parametric Film Grain Noise Overlay (noise=0.11) */}
        <div 
          className="absolute inset-0 opacity-[0.11] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* LEFT CONTENT PANEL */}
      <div className="lg:w-1/2 bg-zinc-950/10 backdrop-blur-sm p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-900/40 relative overflow-hidden transition-all duration-500 z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1f293704_1px,transparent_1px),linear-gradient(to_bottom,#1f293705_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2.5 cursor-pointer z-10" onClick={() => navigateTo("/")}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Shield className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ShiftLog</span>
        </div>

        <div className="space-y-6 my-auto max-w-lg z-10 py-12 lg:py-0">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Take absolute control of your fleet logistics.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Track daily logistics workflows, view automated damage logging feeds, and synchronize vehicle shift handovers with simple, clear reporting metrics.
          </p>

          <div className="space-y-3.5 pt-4">
            {[
              "Seamless shift handovers with automated digital verification",
              "Visual logs for real-time inspection updates",
              "Secure role management policies across team coordinates"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">✓</div>
                <p className="text-sm text-zinc-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-zinc-600 font-mono z-10">
          ShiftLog Framework Engine &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* RIGHT AUTH CARD PANEL */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-transparent relative overflow-hidden z-10">
        
        {/* 💎 HOVER GLOW BORDER AND GLASSMORPHISM MODAL COMPONENT */}
        <div className="w-full max-w-md space-y-6 bg-[#11052a]/25 p-6 lg:p-8 rounded-xl border border-zinc-800/30 backdrop-blur-2xl shadow-2xl transition-all duration-700 group relative hover:border-cyan-500/30 hover:shadow-[0_0_35px_rgba(6,182,212,0.12)]">
          
          {/* Internal Radiant Glow Core */}
          <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 bg-[radial-gradient(30rem_at_50%_50%,rgba(98,11,234,0.08),transparent_100%)]" />

          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white transition-all">
              {authMode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-zinc-400">
              {authMode === "signin" ? "Sign in to access your fleet monitor dashboard" : "Start coordinating your logistics workflow today"}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 relative z-10">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAuthAction} className="space-y-4 relative z-10">
            {authMode === "signup" && (
              <div className="space-y-1.5 animate-in fade-in-50 duration-300">
                <label className="text-xs font-medium text-zinc-400">Full Name</label>
                <div className="relative h-11">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ronit Rao"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-full bg-zinc-950/60 border border-zinc-800/60 rounded-lg pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Email Address</label>
              <div className="relative h-11">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full bg-zinc-950/60 border border-zinc-800/60 rounded-lg pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <div className="relative h-11">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full bg-zinc-950/60 border border-zinc-800/60 rounded-lg pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-bold mt-2 shadow-md hover:shadow-cyan-500/10 transition-all duration-300" disabled={loading}>
              {loading ? "Authenticating..." : authMode === "signin" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2 inline" />}
            </Button>
          </form>

          <div className="relative flex items-center justify-center py-2 relative z-10">
            <div className="absolute w-full border-t border-zinc-800/80" />
            <span className="relative bg-[#09090b] px-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider"> OR </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-11 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/50 text-sm font-medium text-zinc-200 transition-all duration-200 hover:bg-zinc-900 hover:text-white active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-cyan-500 relative z-10"
          >
            <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.15 8.79 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.5h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.98 3.38-4.89 3.38-8.55z"/>
              <path fill="#FBBC05" d="M5.1 14.7c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37l-3.6-2.8C.54 8.78 0 10.33 0 12s.54 3.22 1.5 4.68l3.6-2.98z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.02.68-2.33 1.09-4.3 1.09-3.21 0-5.99-2.11-6.96-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
            </svg>
            Continue with Google
          </button>

          <div className="text-center pt-2 relative z-10">
            <p className="text-xs text-zinc-400">
              {authMode === "signin" ? "New to ShiftLog?" : "Already have an account?"}{" "}
              <button
                onClick={() => navigateTo(authMode === "signin" ? "/signup" : "/login")}
                className="text-cyan-400 font-semibold hover:underline bg-transparent border-none cursor-pointer outline-none ml-1"
              >
                {authMode === "signin" ? "Get Started" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Injecting CSS Keyframes via inline configuration to prevent tailwind.config expansion friction */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spotlight {
          0% { --spotlight-x: 20%; --spotlight-y: 35%; }
          40% { --spotlight-x: 75%; --spotlight-y: 60%; }
          70% { --spotlight-x: 45%; --spotlight-y: 80%; }
          100% { --spotlight-x: 80%; --spotlight-y: 25%; }
        }
      `}} />

    </div>
  );
}