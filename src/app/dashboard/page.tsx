"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Map from "@/components/map";
import {
  LOCATION_PRESETS,
  LocationPreset,
  EmergencyAlert,
  ReliefCamp
} from "@/lib/mockData";
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  Home,
  Bell,
  HeartHandshake,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Terminal,
  Activity,
  Zap,
  CheckCircle,
  Clock,
  ShieldCheck
} from "lucide-react";

export default function DashboardPage() {
  const [selectedPreset, setSelectedPreset] = useState<LocationPreset>(LOCATION_PRESETS[0]); // Mumbai
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [judgeStage, setJudgeStage] = useState(0);

  // Check demo mode state on mount
  useEffect(() => {
    const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
    setDemoActive(isDemo);
    
    const stage = parseInt(localStorage.getItem("resilio_judge_mode_stage") || "0");
    setJudgeStage(stage);

    if (isDemo || stage > 0) {
      const mum = LOCATION_PRESETS.find(p => p.name.includes("Mumbai"));
      if (mum) setSelectedPreset(mum);
    } else {
      setSelectedPreset(LOCATION_PRESETS[0]);
    }

    async function fetchData() {
      try {
        const [alertsRes, campsRes] = await Promise.all([
          fetch("/api/alerts"),
          fetch("/api/camps")
        ]);
        if (alertsRes.ok && campsRes.ok) {
          const alertsData = await alertsRes.json();
          const campsData = await campsRes.json();
          setAlerts(alertsData);
          setCamps(campsData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleExitDemo = () => {
    localStorage.removeItem("resilio_demo_mode");
    localStorage.removeItem("resilio_judge_mode_stage");
    window.location.href = "/dashboard";
  };

  // Filter alerts by preset city and severity
  const activeAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    
    const matchesPreset = 
      selectedPreset.name.includes("Mumbai") && alert.locationName.toLowerCase().includes("mumbai") ||
      selectedPreset.name.includes("New Delhi") && alert.locationName.toLowerCase().includes("delhi") ||
      selectedPreset.name.includes("Chennai") && alert.locationName.toLowerCase().includes("chennai") ||
      selectedPreset.name.includes("Kolkata") && alert.locationName.toLowerCase().includes("kolkata") ||
      selectedPreset.name.includes("Bengaluru") && alert.locationName.toLowerCase().includes("bengaluru") ||
      selectedPreset.name.includes("Hyderabad") && alert.locationName.toLowerCase().includes("hyderabad") ||
      // Fallback
      (!alert.locationName.toLowerCase().includes("mumbai") && 
       !alert.locationName.toLowerCase().includes("delhi") && 
       !alert.locationName.toLowerCase().includes("chennai") && 
       !alert.locationName.toLowerCase().includes("kolkata") && 
       !alert.locationName.toLowerCase().includes("bengaluru") && 
       !alert.locationName.toLowerCase().includes("hyderabad"));

    return matchesSeverity && (matchesPreset || severityFilter !== "all");
  });

  // Filter camps by selected city
  const activeCamps = camps.filter(camp => {
    if (selectedPreset.name.includes("Mumbai")) return camp.address.includes("Mumbai") || camp.name.includes("Mumbai") || camp.address.includes("Thane");
    if (selectedPreset.name.includes("New Delhi")) return camp.address.includes("New Delhi") || camp.name.includes("Delhi");
    if (selectedPreset.name.includes("Chennai")) return camp.address.includes("Chennai") || camp.name.includes("Chennai");
    if (selectedPreset.name.includes("Kolkata")) return camp.address.includes("Kolkata") || camp.name.includes("Kolkata");
    if (selectedPreset.name.includes("Bengaluru")) return camp.address.includes("Bengaluru") || camp.name.includes("Bengaluru");
    if (selectedPreset.name.includes("Hyderabad")) return camp.address.includes("Hyderabad") || camp.name.includes("Hyderabad");
    return true;
  });

  const criticalCount = activeAlerts.filter(a => a.active && a.severity === "critical").length;
  const activeCampsCount = activeCamps.filter(c => c.status === "open" || c.status === "filling").length;
  const totalCapacity = activeCamps.reduce((sum, c) => sum + c.capacity, 0);
  const totalOccupancy = activeCamps.reduce((sum, c) => sum + c.occupancy, 0);

  const handlePresetChange = (name: string) => {
    if (demoActive || judgeStage > 0) return; 
    const preset = LOCATION_PRESETS.find(p => p.name === name);
    if (preset) {
      setSelectedPreset(preset);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full gap-6 relative">
        
        {/* STEP 7 SUMMARY DASHBOARD OVERLAY */}
        {judgeStage === 6 && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-2xl w-full bg-zinc-950 border-2 border-rose-500/40 glow-box-rose rounded-2xl p-8 space-y-6 font-mono text-zinc-100 relative hud-border">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-rose-500 animate-pulse" />
                  <h3 className="font-black text-sm text-white tracking-widest uppercase">
                    // TACTICAL CRISIS SUMMARY REPORT
                  </h3>
                </div>
                <span className="text-[8px] bg-emerald-950/30 border border-emerald-900/50 px-2.5 py-1 rounded text-emerald-400 font-bold uppercase tracking-widest font-mono">
                  STATUS: CONTAINED_SECURE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl">
                  <span className="text-[8px] text-zinc-550 uppercase tracking-widest font-bold">Population Affected</span>
                  <h4 className="text-xl font-bold text-orange-400 mt-1 font-mono">1,200,000</h4>
                </div>
                <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl">
                  <span className="text-[8px] text-zinc-550 uppercase tracking-widest font-bold">Evacuation Success Rate</span>
                  <h4 className="text-xl font-bold text-emerald-400 mt-1 font-mono">91.5%</h4>
                </div>
                <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl">
                  <span className="text-[8px] text-zinc-550 uppercase tracking-widest font-bold">Shelters Activated</span>
                  <h4 className="text-xl font-bold text-sky-400 mt-1 font-mono">3 Facilities</h4>
                </div>
                <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl">
                  <span className="text-[8px] text-zinc-550 uppercase tracking-widest font-bold">Resources Deployed</span>
                  <h4 className="text-[10px] font-bold text-zinc-200 mt-1 leading-normal">
                    12 Industrial Pumps <br />
                    20 Mobile Generators <br />
                    50 Inflatable Boats
                  </h4>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans border-t border-zinc-900 pt-4">
                This completes the scripted Resilio AI autopilot walkthrough. The platform successfully predicted risk, modeled flood boundaries, broadcast alert streams, planned safe routes, and coordinated shelter logistics.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    localStorage.setItem("resilio_judge_mode_stage", "1");
                    window.location.href = "/dashboard";
                  }}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold uppercase text-[10px] tracking-wider rounded cursor-pointer"
                >
                  REPLAY_DEMO
                </button>
                <button
                  onClick={handleExitDemo}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-[10px] tracking-wider rounded border border-rose-500 cursor-pointer animate-pulse"
                >
                  EXIT_DEMO_MODE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top: Location selector & Info Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-black/80 p-4 rounded-xl border border-zinc-800 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-teal-400">
              <Compass className="w-5 h-5 text-teal-400 animate-spin-slow" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">CHOOSE_ACTIVE_SECTOR:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {LOCATION_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetChange(preset.name)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    selectedPreset.name === preset.name
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/40 font-bold"
                      : "bg-zinc-950/40 text-zinc-500 border-zinc-850 hover:border-zinc-750 hover:text-zinc-300"
                  } ${demoActive || judgeStage > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={demoActive || judgeStage > 0}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-[10px] text-zinc-400 max-w-md leading-relaxed border-l border-zinc-800 pl-3 hidden lg:block font-mono">
            <span className="font-bold text-zinc-200 block mb-0.5 uppercase">// REGIONAL THREAT VECTOR PROFILE</span>
            {selectedPreset.description} Risks: {selectedPreset.riskFactors.join(", ")}
          </div>
        </div>

        {/* EOC Live Telemetry Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          
          {/* Active Disaster Level */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm group hover:border-zinc-800 transition-colors">
            <div>
              <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Active Disaster Level</span>
              <h3 className={`text-xs font-black mt-1.5 uppercase ${
                selectedPreset.name.includes("Mumbai") ? "text-rose-500 animate-alert-blink" :
                selectedPreset.name.includes("Chennai") || selectedPreset.name.includes("Delhi") ? "text-amber-500" :
                "text-emerald-400"
              }`}>
                {selectedPreset.name.includes("Mumbai") ? "LEVEL_4 (CRITICAL)" :
                 selectedPreset.name.includes("Chennai") ? "LEVEL_3 (WARNING)" :
                 selectedPreset.name.includes("Delhi") ? "LEVEL_2 (ALERT)" : "LEVEL_1 (NOMINAL)"}
              </h3>
            </div>
            <div className={`w-9 h-9 rounded flex items-center justify-center border ${
              selectedPreset.name.includes("Mumbai") ? "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse" : "bg-zinc-900/40 text-zinc-650 border-zinc-850"
            }`}>
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Population at Risk */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm group hover:border-zinc-800 transition-colors">
            <div>
              <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Population At Risk</span>
              <h3 className="text-sm font-black font-mono text-white mt-1">
                {selectedPreset.name.includes("Mumbai") ? "45,000" : 
                 activeAlerts.length > 0 ? (activeAlerts.length * 15000).toLocaleString() : "0"}
              </h3>
            </div>
            <div className="w-9 h-9 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Shelters Activated */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm group hover:border-zinc-800 transition-colors">
            <div>
              <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Shelters Activated</span>
              <h3 className="text-xs font-black font-mono text-white mt-1.5 uppercase">
                {selectedPreset.name.includes("Mumbai") ? "3 Facilities" :
                 activeCampsCount > 0 ? `${activeCampsCount} Facilities` : "0 Facilities"}
              </h3>
            </div>
            <div className="w-9 h-9 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Home className="w-4.5 h-4.5" />
            </div>
          </div>

          {/* Emergency Teams Deployed */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm group hover:border-zinc-800 transition-colors">
            <div>
              <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Teams Deployed</span>
              <h3 className="text-xs font-black font-mono text-emerald-400 mt-1.5 uppercase">
                {selectedPreset.name.includes("Mumbai") ? "350 Responders" :
                 activeAlerts.length > 0 ? `${activeAlerts.length * 60 + 20} Responders` : "10 Standby"}
              </h3>
            </div>
            <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* Main interactive split workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          
          {/* Left Panel: Alerts, Camps */}
          <div className="flex flex-col gap-6 lg:col-span-1 overflow-y-auto max-h-[600px] pr-2">
            
            {/* Live Alerts feed */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex flex-col backdrop-blur-sm relative z-10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rose-500" />
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Live Threat Index</h3>
                </div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-zinc-950 text-zinc-400 border border-zinc-800 rounded text-[9px] font-bold uppercase px-2 py-1 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">ALL_SEVERITY</option>
                  <option value="critical">CRITICAL</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8 text-zinc-550 text-[9px] font-mono animate-pulse">
                  RETRIEVING_DATA_STREAM...
                </div>
              ) : activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8 text-zinc-550 font-mono">
                  <ShieldAlert className="w-7 h-7 text-zinc-850 mb-2" />
                  <span className="text-[10px]">NO_ACTIVE_THREATS_DETECTED</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded border transition-all hover:bg-zinc-900/30 relative ${
                        alert.severity === "critical" ? "bg-rose-950/10 border-rose-900/50 hover:border-rose-900" :
                        alert.severity === "high" ? "bg-orange-950/10 border-orange-900/50 hover:border-orange-900" :
                        alert.severity === "medium" ? "bg-amber-950/10 border-amber-900/50 hover:border-amber-900" :
                        "bg-zinc-950/40 border-zinc-850 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1 rounded text-[8px] font-black uppercase tracking-wider ${
                          alert.severity === "critical" ? "bg-rose-500 text-zinc-950 animate-alert-blink" :
                          alert.severity === "high" ? "bg-orange-500 text-zinc-950" :
                          alert.severity === "medium" ? "bg-amber-500 text-zinc-950" : "bg-emerald-500 text-zinc-950"
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-[11px] text-zinc-100 leading-snug">{alert.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-normal line-clamp-3 font-sans">{alert.description}</p>
                      <div className="text-[8px] mt-2 text-zinc-550 font-mono flex items-center gap-1 border-t border-zinc-900/40 pt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                        <span>SECTOR: {alert.locationName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Relief Camps status */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex flex-col backdrop-blur-sm relative z-10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Tactical Shelters</h3>
                </div>
                <span className="text-[9px] bg-zinc-900 text-zinc-550 font-mono px-2 py-0.5 rounded border border-zinc-800">
                  {activeCamps.length} REG_UNITS
                </span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8 text-zinc-550 text-[9px] font-mono">
                  QUERYING_SHELTER_TELEMETRY...
                </div>
              ) : activeCamps.length === 0 ? (
                <div className="text-center py-8 text-zinc-550 text-[10px] font-mono">
                  NO_SHELTERS_REGISTERED
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {activeCamps.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-3 rounded bg-zinc-950/40 border border-zinc-850 flex flex-col gap-2 transition-all hover:bg-zinc-900/20"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[11px] text-zinc-200">{camp.name}</h4>
                          <span className="text-[9px] text-zinc-500 block leading-tight">{camp.address}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                          camp.status === "open" ? "bg-emerald-500/25 text-emerald-400" :
                          camp.status === "filling" ? "bg-indigo-500/25 text-indigo-400" :
                          camp.status === "full" ? "bg-violet-500/25 text-violet-400" : "bg-zinc-850 text-zinc-500"
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                      
                      {/* Occupancy Indicator */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] text-zinc-550 font-mono">
                          <span>OCCUPANCY:</span>
                          <span>{camp.occupancy} / {camp.capacity} ({Math.round((camp.occupancy / camp.capacity) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded overflow-hidden border border-zinc-850">
                          <div 
                            className={`h-full rounded-none ${
                              camp.occupancy / camp.capacity > 0.95 ? "bg-rose-500" :
                              camp.occupancy / camp.capacity > 0.85 ? "bg-violet-500" : "bg-sky-500"
                            }`}
                            style={{ width: `${(camp.occupancy / camp.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Map (Span 2 cols) */}
          <div className="lg:col-span-2 flex flex-col h-[500px] lg:h-auto">
            <div className="flex justify-between items-center px-3 py-1.5 bg-black/80 border-t border-x border-zinc-800 rounded-t-xl text-[9px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span>
                <span>TACTICAL_GRID_FEED // LAT: {selectedPreset.lat.toFixed(4)} LNG: {selectedPreset.lng.toFixed(4)}</span>
              </div>
              {(demoActive || judgeStage > 0) && (
                <span className="text-rose-400 font-bold animate-pulse">// SCENARIO_LOCKED: MUMBAI_FLOOD</span>
              )}
            </div>
            <div className="flex-1 min-h-[400px]">
              <Map
                center={[selectedPreset.lat, selectedPreset.lng]}
                zoom={13}
                alerts={alerts}
                camps={camps}
              />
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
