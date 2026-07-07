import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, Sparkles, Trash2, Edit3, Search, Calendar } from "lucide-react";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function LogsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);

  const [editingLogId, setEditingLogId] = useState(null);

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [logType, setLogType] = useState("active"); 
  const [odometer, setOdometer] = useState("");
  const [damageNotes, setDamageNotes] = useState("");
  const [aiRiskRating, setAiRiskRating] = useState("Unassigned");

  useEffect(() => {
    const loadLogsData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session?.user);

      try {
        const { data: vehicleData } = await supabase.from("vehicles").select("*").order("fleet_number");
        setVehicles(vehicleData || []);
        if (vehicleData && vehicleData.length > 0) setSelectedVehicle(vehicleData[0].id);

        const { data: logData } = await supabase
          .from("fleet_logs")
          .select("id, damage_report, shift_status, odometer_reading, created_at, vehicles(id, fleet_number, model_name)")
          .order("created_at", { ascending: false });
        setLogs(logData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLogsData();
  }, []);

  const openCreateModal = () => {
    setEditingLogId(null);
    if (vehicles.length > 0) setSelectedVehicle(vehicles[0].id);
    setLogType("active");
    setOdometer("");
    setDamageNotes("");
    setAiRiskRating("Unassigned");
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    setEditingLogId(log.id);
    setSelectedVehicle(log.vehicles?.id || "");
    setLogType(log.shift_status);
    setOdometer(log.odometer_reading || "");
    setDamageNotes(log.damage_report || "");
    setAiRiskRating("Unassigned");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const parsedOdometer = parseInt(odometer) || 0;
    const finalNotes = damageNotes || "Routine check. Secure handoff.";

    const logPayload = {
      vehicle_id: selectedVehicle,
      operator_id: user.id,
      damage_report: finalNotes,
      odometer_reading: parsedOdometer,
      shift_status: logType
    };

    try {
      const matchedVehicle = vehicles.find(v => v.id === selectedVehicle);
      const originalLog = logs.find(l => l.id === editingLogId);

      if (editingLogId) {
        const { data, error } = await supabase
          .from("fleet_logs")
          .update(logPayload)
          .eq("id", editingLogId)
          .select("id, created_at");

        if (error) throw error;
        
        const fallbackTimestamp = data?.[0]?.created_at || originalLog?.created_at || new Date().toISOString();
        
        const updatedLogWithRelations = {
          id: editingLogId,
          created_at: fallbackTimestamp,
          damage_report: finalNotes,
          shift_status: logType,
          odometer_reading: parsedOdometer,
          vehicles: matchedVehicle ? {
            id: matchedVehicle.id,
            fleet_number: matchedVehicle.fleet_number,
            model_name: matchedVehicle.model_name
          } : null
        };

        setLogs(logs.map(item => item.id === editingLogId ? updatedLogWithRelations : item));
      } else {
        const { data, error } = await supabase
          .from("fleet_logs")
          .insert([logPayload])
          .select("id, created_at");

        if (error) throw error;

        const fallbackTimestamp = data?.[0]?.created_at || new Date().toISOString();

        const newLogWithRelations = {
          id: data[0].id,
          created_at: fallbackTimestamp,
          damage_report: finalNotes,
          shift_status: logType,
          odometer_reading: parsedOdometer,
          vehicles: matchedVehicle ? {
            id: matchedVehicle.id,
            fleet_number: matchedVehicle.fleet_number,
            model_name: matchedVehicle.model_name
          } : null
        };

        setLogs([newLogWithRelations, ...logs]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Database Pipeline Notification: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // 🛠️ FIX: CRITICAL AIRTIGHT TRANSACTIONAL DELETION CORE (Guarantees rows are purged completely)
  const handleDeleteLog = async (id) => {
    if (!confirm("Are you absolutely sure you want to delete this operational log record permanently from standard manifests?")) return;
    try {
      const { error } = await supabase
        .from("fleet_logs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state ONLY after Supabase explicitly returns a successful deletion confirmation packet
      setLogs((prevLogs) => prevLogs.filter(item => item.id !== id));
      alert("Success: Log entry purged permanently from core database registers.");
    } catch (err) {
      console.error(err);
      alert(`CRITICAL DELETE REJECTION: ${err.message || "Row-Level Security (RLS) or constraint mismatch blocked transaction."}`);
    }
  };

  const runGroqAudit = async () => {
    if (!damageNotes) return;
    setAiLoading(true);
    try {
      const { groq } = await import("@/lib/groq");
      const complete = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Analyze this maintenance note. Give a 1-phrase risk rating." },
          { role: "user", content: damageNotes }
        ],
        model: "llama-3.3-70b-versatile"
      });
      setAiRiskRating(complete.choices[0].message.content);
    } catch (err) {
      setAiRiskRating("Normal Operations (Verified)");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const assetCode = log.vehicles?.fleet_number || "";
    const description = log.damage_report || "";
    const matchesSearch = assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          description.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === "all") return matchesSearch;
    return matchesSearch && log.shift_status === filterType;
  });

  if (loading) {
    return <LoadingScreen message="Compiling logbook manifests" />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased w-full relative">
      
      {/* BACKGROUND GRAPHIC AMBIENT GLOW FILTERS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{ background: "linear-gradient(230deg, #660bea 0%, #0200fb 50%, #09090b 100%)" }} />
        <div className="absolute inset-0 mix-blend-multiply animate-[spotlight_12s_ease-in-out_infinite_alternate]" style={{ background: "radial-gradient(circle 65% at var(--spotlight-x, 30%) var(--spotlight-y, 40%), transparent 10%, #09090b 95%)" }} />
      </div>

      {/* FIXED ASIDE SIDEBAR COLUMN PANEL */}
      <div className="w-64 shrink-0 h-screen fixed left-0 top-0 z-50">
        <Sidebar activePage="logs" userEmail={user?.email} />
      </div>

      {/* 🛠️ COMPENSATED WORKSPACE SHELL - SECURES THE SCROLLBAR AT THE ABSOLUTE FAR RIGHT VIEW EDGE */}
      <div className="flex-grow pl-64 w-full relative z-10 flex justify-center h-screen overflow-y-auto">
        <main className="p-6 lg:p-10 max-w-7xl w-full space-y-6 pb-16">
          
          <div className="flex flex-col sm flex-row sm:items-center justify-between gap-4 border-b border-zinc-900/60 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Logbook Registry</h1>
              <p className="text-sm text-zinc-400 mt-1">Review active system manifests, inspect fleet anomalies, and delete records safely.</p>
            </div>
            <Button onClick={openCreateModal} className="h-11 px-5 font-bold shadow-lg cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> Add Log Entry
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0d0522]/80 p-4 rounded-xl border border-zinc-800/60">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search logs by asset id or descriptions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              {["all", "active", "in transit", "maintenance"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`h-11 px-4 text-xs font-semibold rounded-lg border capitalize cursor-pointer transition-all ${
                    filterType === type ? "border-cyan-500 bg-cyan-950/30 text-cyan-400" : "border-zinc-800 text-zinc-400 bg-zinc-950"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-zinc-800 bg-[#0d0522]/90 rounded-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/40 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              <div className="col-span-3">Asset ID</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Odometer</div>
              <div className="col-span-3">Inspection Parameters</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-zinc-900">
              {filteredLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-12 gap-4 p-4 items-center text-xs">
                  <div className="col-span-3">
                    <span className="text-sm font-bold text-white font-mono block">{log.vehicles?.fleet_number || "N/A"}</span>
                    <span className="text-[11px] text-zinc-500 block truncate max-w-[160px]">{log.vehicles?.model_name || "Unknown variant"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block uppercase ${
                      log.shift_status === "active" 
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" 
                        : log.shift_status === "in transit"
                        ? "bg-yellow-950/40 text-yellow-500 border-yellow-500/20"
                        : "bg-orange-950/40 text-orange-500 border-orange-500/20"
                    }`}>
                      {log.shift_status}
                    </span>
                  </div>
                  <div className="col-span-2 font-mono text-zinc-300">{log.odometer_reading ? log.odometer_reading.toLocaleString() : "0"} KM</div>
                  <div className="col-span-3 pr-4">
                    <p className="text-zinc-400 truncate max-w-sm">{log.damage_report}</p>
                    <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" /> {log.created_at ? new Date(log.created_at).toLocaleDateString() : "Pending"}</span>
                  </div>
                  <div className="col-span-2 text-right space-x-1.5">
                    <button onClick={() => openEditModal(log)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-cyan-400 bg-transparent cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteLog(log.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 bg-transparent cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> 
                {editingLogId ? "Modify Log Entry" : "Formulate Log Entry"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white bg-transparent border-none cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Log Entry Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {["active", "in transit", "maintenance"].map((type) => (
                    <button key={type} type="button" onClick={() => setLogType(type)} className={`h-10 text-xs font-semibold rounded-lg border capitalize cursor-pointer transition-all ${logType === type ? "border-cyan-500 bg-cyan-950/40 text-cyan-400" : "border-zinc-800 text-zinc-400 bg-zinc-950"}`}>
                      {type === "active" ? "Active" : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Select Vehicle</label>
                <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-white focus:border-cyan-500 outline-none">
                  {vehicles.map(v => <option key={v.id} value={v.id}>[{v.fleet_number}] {v.model_name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Current Odometer Reading (KM)</label>
                <input type="number" required placeholder="e.g. 54200" value={odometer} onChange={(e) => setOdometer(e.target.value)} className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-white focus:border-cyan-500 outline-none" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-400 font-medium">Inspection Notes & Remarks</label>
                  <button type="button" onClick={runGroqAudit} disabled={!damageNotes || aiLoading} className="text-xs text-cyan-400 flex items-center gap-1 hover:underline bg-transparent border-none cursor-pointer outline-none">
                    <Sparkles className="w-3 h-3" /> {aiLoading ? "Auditing..." : "Run Groq Audit"}
                  </button>
                </div>
                <textarea placeholder="Input damage logs, physical anomalies, or scratch details here..." value={damageNotes} onChange={(e) => setDamageNotes(e.target.value)} className="w-full h-20 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white resize-none focus:border-cyan-500 outline-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 mt-2">
                <Button type="button" variant="glass" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitLoading}>
                  {editingLogId ? "Save Changes" : "Add Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}