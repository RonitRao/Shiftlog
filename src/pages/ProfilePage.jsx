import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sendFleetEmailReport } from "@/lib/emailService";
import { User, Shield, Mail, CheckCircle, AlertCircle, RefreshCw, Landmark, Award, Layers, Key, Fingerprint, Clock } from "lucide-react";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Core profile fields
  const [fullName, setFullName] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [depotHub, setDepotHub] = useState("");
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    const loadProfileData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const activeUser = session?.user;
      setUser(activeUser);

      try {
        let { data: profile } = await supabase
          .from("operator_profiles")
          .select("*")
          .eq("id", activeUser.id)
          .single();

        const derivedFallbackName = activeUser.email ? activeUser.email.split("@")[0] : "Operator Specialist";

        if (!profile) {
          const defaultProfile = { 
            id: activeUser.id, 
            full_name: derivedFallbackName, 
            license_type: "Class A CDL", 
            depot_hub: "" 
          };
          await supabase.from("operator_profiles").insert([defaultProfile]);
          profile = defaultProfile;
        }

        setFullName(profile.full_name === "Operator Specialist" ? derivedFallbackName : profile.full_name);
        setLicenseType(profile.license_type || "Class A CDL");
        setDepotHub(profile.depot_hub === "Central Logistics Hub" ? "" : profile.depot_hub);

        const { count } = await supabase
          .from("fleet_logs")
          .select("id", { count: "exact", head: true })
          .eq("operator_id", activeUser.id);
        
        setLogCount(count || 0);
      } catch (err) {
        console.error("Profile recovery handling anomaly:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setStatusMessage("");

    try {
      const { error } = await supabase
        .from("operator_profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          license_type: licenseType,
          depot_hub: depotHub,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setStatusMessage("Success: Configuration map persistent state updated successfully.");
    } catch (err) {
      setStatusMessage("Error: Remote database refused state update packet write.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTriggerEmailTest = async () => {
    setEmailLoading(true);
    setStatusMessage("");

    try {
      // Trigger Edge Function directly via clean network abstraction layer
      await sendFleetEmailReport(user.email, { 
        full_name: fullName, 
        license_type: licenseType, 
        depot_hub: depotHub || "Unassigned" 
      });
      
      setStatusMessage("Success: System diagnostic metrics report transmitted successfully.");
    } catch (err) {
      console.error("Resend API Failure Details:", err);
      setStatusMessage(`Error: Transmission failed. [${err.message}]`);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Compiling logbook manifests" />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased relative w-full overflow-hidden">
      
      {/* BACKGROUND ACCENT KINETIC CANVAS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{ background: "linear-gradient(230deg, #660bea 0%, #0200fb 50%, #09090b 100%)" }} />
        <div className="absolute inset-0 flex justify-between opacity-25 filter blur-[1px] transform rotate-12 scale-125 animate-[slide_3s_ease-in-out_infinite_alternate]">
          {[...Array(32)].map((_, i) => (
            <div key={i} className="h-full bg-zinc-950/90" style={{ width: `${12 + (i % 3) * 6}px`, minWidth: "10px" }} />
          ))}
        </div>
      </div>

      {/* FIXED LEFT SIDEBAR */}
      <div className="w-64 shrink-0 h-screen fixed left-0 top-0 z-50">
        <Sidebar activePage="profile" userEmail={user?.email} />
      </div>

      {/* COMPENSATED MAIN LAYOUT BODY */}
      <div className="flex-grow pl-72 pr-8 w-full relative z-10 flex justify-center h-screen overflow-y-auto">
        <main className="p-6 lg:p-10 max-w-4xl w-full space-y-8 pb-16">
          
          <div className="border-b border-zinc-900 pb-6">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
              <Shield className="w-3.5 h-3.5" /> Security Operations Environment
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Profile & Operator Settings</h1>
            <p className="text-sm text-zinc-400 mt-1">Configure asset credentials, check real-time data syncs, and manage email alerts.</p>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono tracking-wide shadow-2xl border-l-4 ${
              statusMessage.includes("Success") 
                ? "bg-emerald-950/20 border-emerald-500/30 border-l-emerald-500 text-emerald-400" 
                : "bg-cyan-950/20 border-cyan-500/30 border-l-cyan-500 text-cyan-300"
            }`}>
              <div className="flex items-center gap-2.5">
                {statusMessage.includes("Success") ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-cyan-400" />}
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage("")} className="text-zinc-500 hover:text-zinc-300 bg-transparent border-none cursor-pointer text-xs font-mono">
                [Dismiss]
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#0d0522]/90 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Logs Tracked</span>
                <span className="text-lg font-black text-white font-mono mt-0.5 block">{logCount} Entries</span>
              </div>
            </div>
            
            <div className="bg-[#0d0522]/90 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">System Status</span>
                <span className="text-sm font-bold text-amber-400 font-sans mt-1 block bg-amber-950/20 px-2 py-0.5 rounded border border-amber-500/10 uppercase tracking-wide">
                  Verified Person
                </span>
              </div>
            </div>

            <div className="bg-[#0d0522]/90 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Terminal Cluster</span>
                <span className="text-sm font-bold text-zinc-300 font-mono mt-0.5 block truncate">Supabase Core</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d0522]/80 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-4 mb-6">
              <User className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Account Credentials</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wide">Operator Profile Name</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 text-sm text-white placeholder-zinc-700 focus:border-cyan-500 focus:bg-zinc-900/90 outline-none transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wide">Sign-In Identifier</label>
                  <input type="text" disabled value={user?.email || ""} className="w-full h-11 bg-zinc-900/10 border border-zinc-900 text-zinc-600 rounded-xl px-4 text-sm font-mono cursor-not-allowed outline-none shadow-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wide">License Endorsement Tier</label>
                  <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl px-3 text-sm text-white focus:border-cyan-500 focus:bg-zinc-900/90 outline-none transition-all cursor-pointer">
                    <option value="Class A CDL">Class A CDL (Semi / Heavy Cargo)</option>
                    <option value="Class B CDL">Class B CDL (Box / Medium Rig)</option>
                    <option value="Light Courier License">Light Courier Fleet Permit</option>
                    <option value="Standard Commercial">Standard Commercial Endorsement</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wide">Assigned Depot Station Base</label>
                  <input type="text" required placeholder="e.g. Mumbai Logistics Terminal East" value={depotHub} onChange={(e) => setDepotHub(e.target.value)} className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:bg-zinc-900/90 outline-none transition-all shadow-inner" />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex justify-end">
                <Button type="submit" disabled={saveLoading} className="h-11 px-6 font-bold text-xs tracking-wide rounded-xl shadow-lg cursor-pointer">
                  {saveLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Save Local Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* STANDALONE EMAIL CARD MANIFEST SEGMENT */}
          <div className="bg-[#0d0522]/80 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4 relative">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-4">
              <Mail className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Resend Notification Core</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
              Trigger a sandbox verification email routine to send a detailed layout of the current operator log manifests to the account on file.
            </p>
            <div className="pt-2">
              <Button onClick={handleTriggerEmailTest} disabled={emailLoading} variant="outline" className="h-11 font-bold text-xs border-zinc-800 tracking-wide hover:bg-zinc-900 text-zinc-200 hover:text-white rounded-xl cursor-pointer transition-all">
                {emailLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Transmit Manifest Summary Email
              </Button>
            </div>
          </div>

          {/* ACCOUNT DETAILS HUD BLOCK */}
          <div className="bg-[#0d0522]/80 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-4">
              <Key className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Account Details</h3>
            </div>

            <div className="divide-y divide-zinc-900/60 font-mono text-xs text-zinc-300">
              <div className="flex justify-between items-center py-3.5">
                <span className="text-zinc-500 flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5" /> Account ID</span>
                <span className="text-zinc-200 tracking-tight select-all selection:bg-cyan-500/30">{user?.id || "N/A"}</span>
              </div>
              
              <div className="flex justify-between items-center py-3.5">
                <span className="text-zinc-500 flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Sign-in Method</span>
                <span className="text-zinc-200 capitalize bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800/40">
                  {user?.app_metadata?.provider || "Email"}
                </span>
              </div>

              <div className="flex justify-between items-center py-3.5">
                <span className="text-zinc-500 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Last Authentication Trace</span>
                <span className="text-zinc-200">
                  {user?.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", { 
                        month: "long", 
                        day: "numeric", 
                        year: "numeric", 
                        hour: "2-digit", 
                        minute: "2-digit",
                        second: "2-digit",
                        timeZoneName: "short"
                      }) 
                    : "Trace Unavailable"}
                </span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}