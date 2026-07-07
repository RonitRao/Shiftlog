import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { groq } from "@/lib/groq"; 
import { 
  UploadCloud, 
  Sparkles, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Cpu, 
  Eye, 
  Layers, 
  Sliders 
} from "lucide-react";

export default function AiScannerPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [scanResult, setScanResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  
  const [isConfirmerOpen, setIsConfirmerOpen] = useState(false);

  const [formVehicleId, setFormVehicleId] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    const initScanner = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session?.user);

      try {
        const { data } = await supabase.from("vehicles").select("id, fleet_number, model_name");
        setVehicles(data || []);
      } catch (err) {
        console.error("Failed to load vehicle reference table", err);
      } finally {
        setLoading(false);
      }
    };
    initScanner();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
    setStatusMessage("");
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRunVisionScan = async () => {
    if (!imageFile) return;
    setScanLoading(true);
    setStatusMessage("");

    const defaultVehicleId = vehicles[0]?.id || "";
    const defaultFleetNumber = vehicles[0]?.fleet_number || "FL-001";
    const defaultModelName = vehicles[0]?.model_name || "Heavy Duty Cargo Van";

    try {
      const base64Image = await fileToBase64(imageFile);
      const fleetContext = vehicles.map(v => `ID: ${v.id}, Number: ${v.fleet_number}, Model: ${v.model_name}`).join("\n");

      const promptText = `
        You are an expert logistics AI inspector evaluating a vehicle's operational status.
        Analyze the provided image accurately. Do not use generic fallback phrases.
        
        Compare the vehicle category in the image with this official asset fleet registry database list:
        ${fleetContext}

        TASK:
        1. Identify which vehicle from the list provided matches the category/type in the image (e.g. standard van vs box truck). If unsure, pick the closest matching asset layout.
        2. Evaluate physical attributes or visible defects accurately. If there is an accident crush/dent, note it. If there is rust/corrosion, note it.
        3. Assign an operational status based on severity ('active', 'in transit', 'maintenance').
        4. Write a brief 1-sentence, human-like diagnostic description of the damage visible.

        CRITICAL OUTPUT CONSTRAINT:
        You must reply with a single, raw JSON object matching the exact keys below. 
        Do not wrap your output in markdown formatting ticks like \`\`\`json.
        Do not output any explanation text.

        Expected Structure:
        {
          "matched_vehicle_id": "the exact string UUID from the list provided",
          "fleet_number": "the fleet_number matching the asset",
          "model_name": "the model_name string matched",
          "assigned_status": "active" or "in transit" or "maintenance",
          "inspection_parameters": "Your distinct, custom damage analysis text here"
        }
      `;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct" 
      });

      let rawContent = response.choices[0].message.content.trim();
      
      if (rawContent.startsWith("```")) {
        rawContent = rawContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      let parsedData = JSON.parse(rawContent);

      const uuidExists = vehicles.some(v => v.id === parsedData.matched_vehicle_id);
      if (!uuidExists) {
        parsedData.matched_vehicle_id = defaultVehicleId;
      }

      setScanResult(parsedData);
      setFormVehicleId(parsedData.matched_vehicle_id);
      setFormStatus(parsedData.assigned_status);
      setFormNotes(parsedData.inspection_parameters);
      setStatusMessage("Success: Groq Neural Vision Diagnostic Complete.");
    } catch (err) {
      console.error("Vision Processing Exception caught: ", err);
      setStatusMessage(`AI Engine Error: ${err.message || "Failed parsing matrix layers."}`);
      
      setScanResult({
        matched_vehicle_id: defaultVehicleId,
        fleet_number: defaultFleetNumber,
        model_name: defaultModelName,
        assigned_status: "maintenance",
        inspection_parameters: `CRITICAL PIPELINE ERROR: ${err.message || "The AI model rejected the payload structure."}`
      });
    } finally {
      setScanLoading(false);
    }
  };

  const handleCommitToLogbook = async (e) => {
    e.preventDefault();
    if (!formVehicleId) return;
    setCommitLoading(true);

    try {
      const { error } = await supabase
        .from("fleet_logs")
        .insert([{
          vehicle_id: formVehicleId,
          operator_id: user.id,
          damage_report: formNotes,
          odometer_reading: null,
          shift_status: formStatus
        }]);

      if (error) throw error;
      setStatusMessage("Success: Telemetry analysis logged seamlessly into standard manifests.");
      setIsConfirmerOpen(false);
      setScanResult(null);
      setImageFile(null);
      setPreviewUrl("");
    } catch (err) {
      alert("Pipeline insertion failure: " + err.message);
    } finally {
      setCommitLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Compiling logbook manifests" />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased relative overflow-x-hidden">
      
      {/* BACKGROUND GRAPHIC INTERFACE MAP */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{ background: "linear-gradient(230deg, #660bea 0%, #0200fb 50%, #09090b 100%)" }} />
        <div className="absolute inset-0 flex justify-between opacity-25 filter blur-[1px] transform rotate-12 scale-125 animate-[slide_3s_ease-in-out_infinite_alternate]">
          {[...Array(32)].map((_, i) => (
            <div key={i} className="h-full bg-zinc-950/90" style={{ width: `${12 + (i % 3) * 6}px`, minWidth: "10px" }} />
          ))}
        </div>
        <div className="absolute inset-0 mix-blend-multiply animate-[spotlight_12s_ease-in-out_infinite_alternate]" style={{ background: "radial-gradient(circle 65% at var(--spotlight-x, 30%) var(--spotlight-y, 40%), transparent 10%, #09090b 95%)" }} />
      </div>

      {/* FIXED SIDEBAR PIN HOUSING */}
      <div className="w-64 shrink-0 h-screen fixed left-0 top-0 z-50">
        <Sidebar activePage="ai-scanner" userEmail={user?.email} />
      </div>

      {/* REALIGNED MAIN CONTAINER GRID */}
      <div className="flex-grow pl-72 pr-8 w-full relative z-10 flex justify-center">
        <main className="p-6 lg:p-10 max-w-7xl w-full space-y-8 overflow-y-auto h-screen pb-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
                <Cpu className="w-3.5 h-3.5 animate-pulse" /> Multimodal Analytics Core
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">AI Fleet Vision Inspector</h1>
              <p className="text-sm text-zinc-400 mt-0.5">Streamline diagnostic pipelines using processing models for rapid log synchronization.</p>
            </div>
          </div>

          {/* 💎 RESTORED ACCURATE EMERALD GREEN DESIGN BANNER */}
          {statusMessage && (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono tracking-wide shadow-2xl transition-all border-l-4 ${
              statusMessage.includes("Success") 
                ? "bg-emerald-950/20 border-emerald-500/30 border-l-emerald-500 text-emerald-400" 
                : "bg-red-950/20 border-red-500/30 border-l-red-500 text-red-400"
            }`}>
              <div className="flex items-center gap-2">
                {statusMessage.includes("Success") ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage("")} className="text-zinc-500 hover:text-zinc-300 bg-transparent border-none cursor-pointer text-xs">
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 px-1 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-zinc-600" /> Asset Inspection Media
              </div>

              {!previewUrl ? (
                <div className="bg-[#0d0522]/60 backdrop-blur-md border border-zinc-800/80 p-12 border-dashed rounded-2xl flex flex-col items-center justify-center text-center relative h-[340px] group transition-all hover:border-zinc-700/80">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:scale-105 transition-all mb-4">
                    <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400 transition-all" />
                  </div>
                  <p className="text-sm text-zinc-200 font-bold tracking-tight">Insert Vehicle Snapshot</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">Drag snapshot frame here / Browse files</p>
                </div>
              ) : (
                <div className="bg-[#0d0522]/90 border border-zinc-800/80 p-4 rounded-2xl space-y-4 shadow-2xl relative">
                  <div className="aspect-[4/3] w-full rounded-xl bg-zinc-900 overflow-hidden relative border border-zinc-800/60">
                    <img src={previewUrl} alt="Staged fleet view" className="w-full h-full object-cover" />
                    {!scanLoading && (
                      <button 
                        onClick={() => { setPreviewUrl(""); setImageFile(null); setScanResult(null); setStatusMessage(""); }}
                        className="absolute top-3 right-3 bg-zinc-950/90 hover:bg-red-950/80 border border-zinc-800 p-2 rounded-xl text-zinc-400 hover:text-red-400 transition-all cursor-pointer shadow-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {!scanResult && (
                    <Button 
                      onClick={handleRunVisionScan} 
                      disabled={scanLoading} 
                      className="w-full h-12 font-bold shadow-lg tracking-wide flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      {scanLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-cyan-400" />}
                      {scanLoading ? "Parsing Matrix Layers..." : "Compute Neural Vision Scan"}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 px-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-600" /> Inspection Results
              </div>

              {scanResult ? (
                <div className="grid grid-cols-1 gap-5 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[#0d0522]/90 border border-zinc-800/80 p-6 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                      <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                        Extracted Parameters
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">Target Asset Code</label>
                        <p className="text-xl font-black text-white font-mono tracking-tight">{scanResult.fleet_number || "Unassigned"}</p>
                      </div>

                      <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Condition State Mapping</label>
                        <div>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border inline-flex items-center gap-1.5 uppercase tracking-wide ${
                            scanResult.assigned_status === "active" 
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" 
                              : "bg-orange-950/40 text-orange-400 border-orange-500/20"
                          }`}>
                            {scanResult.assigned_status || "maintenance"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">Variant Identity String</label>
                      <p className="text-sm font-semibold text-zinc-200">{scanResult.model_name || "Unknown Model Type"}</p>
                    </div>

                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Neural Text Diagnostics</label>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-950/90 p-4 rounded-lg border border-zinc-900/60 max-h-32 overflow-y-auto">
                        {scanResult.inspection_parameters}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <Button variant="outline" className="w-1/3 h-11 text-xs font-bold tracking-wide rounded-xl cursor-pointer" onClick={() => { setScanResult(null); setPreviewUrl(""); setImageFile(null); setStatusMessage(""); }}>
                        Purge Frame
                      </Button>
                      <Button onClick={() => setIsConfirmerOpen(true)} className="w-2/3 h-11 text-xs font-bold tracking-wide rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-1.5">
                        <Plus className="w-4 h-4" /> Verify & Save to Matrix
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0d0522]/40 border border-zinc-900/40 p-8 rounded-2xl h-[340px] flex flex-col items-center justify-center text-center text-zinc-600 font-mono text-xs">
                  <Sliders className="w-8 h-8 text-zinc-800 mb-2 stroke-[1.5]" />
                  Waiting for snapshot capture pipeline initialization...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isConfirmerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 w-full max-w-lg rounded-2xl border border-zinc-800/80 p-6 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white tracking-tight">Confirm Extracted Details</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">Verify properties prior to logbook push</p>
                </div>
              </div>
              <button onClick={() => setIsConfirmerOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCommitToLogbook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wider">Verified Asset Node</label>
                <select value={formVehicleId} onChange={(e) => setFormVehicleId(e.target.value)} className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-sm text-white focus:border-cyan-500 outline-none">
                  {vehicles.map(v => <option key={v.id} value={v.id}>[{v.fleet_number}] {v.model_name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wider">Assigned Operational State</label>
                <div className="grid grid-cols-3 gap-2">
                  {["active", "in transit", "maintenance"].map((type) => (
                    <button key={type} type="button" onClick={() => setFormStatus(type)} className={`h-11 text-xs font-semibold rounded-xl border capitalize cursor-pointer transition-all ${formStatus === type ? "border-cyan-500 bg-cyan-950/40 text-cyan-400" : "border-zinc-800 text-zinc-400 bg-zinc-900"}`}>
                      {type === "active" ? "Active" : type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium font-mono uppercase tracking-wider">Inspection Parameter Remarks</label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white resize-none focus:border-cyan-500 outline-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900 mt-4">
                <Button type="button" variant="glass" className="h-11 rounded-xl font-bold px-4 text-xs tracking-wide cursor-pointer border border-zinc-800 hover:bg-zinc-900" onClick={() => setIsConfirmerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={commitLoading} className="h-11 rounded-xl font-bold px-5 text-xs tracking-wide shadow-lg cursor-pointer">
                  {commitLoading ? "Syncing..." : "Push Transaction Log"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}