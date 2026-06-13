"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { EmergencyAlert, LOCATION_PRESETS } from "@/lib/mockData";
import {
  Bell,
  AlertTriangle,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  Filter,
  Check,
  ShieldCheck,
  Terminal
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form states for broadcasting a new alert
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("high");
  const [category, setCategory] = useState<"Flood" | "Fire" | "Landslide" | "Disease" | "Weather" | "Seismic">("Flood");
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [customLocationName, setCustomLocationName] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [demoActive, setDemoActive] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error("Failed to load alerts feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
    setDemoActive(isDemo);
    if (isDemo) {
      // Mumbai is index 0 inpresets
      setSelectedPresetIdx(0);
      setFilterStatus("active");
    }
    fetchAlerts();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!title.trim() || !description.trim()) {
      setFormError("Title and Description fields must be filled out.");
      return;
    }

    const preset = LOCATION_PRESETS[selectedPresetIdx];
    const locationName = customLocationName.trim() || `${preset.name} (EOC Broadcast)`;
    const payload = {
      title,
      description,
      severity,
      category,
      locationName,
      lat: preset.lat + (Math.random() - 0.5) * 0.02,
      lng: preset.lng + (Math.random() - 0.5) * 0.02,
    };

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormSuccess(true);
        setTitle("");
        setDescription("");
        setCustomLocationName("");
        await fetchAlerts();
        setTimeout(() => setFormSuccess(false), 3000);
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to broadcast alert.");
      }
    } catch (err) {
      setFormError("Network communication error.");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch("/api/alerts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchAlerts();
      }
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && alert.active) || 
      (filterStatus === "resolved" && !alert.active);

    // If demo mode is active, filter alerts lists to only show Mumbai alerts by default
    const matchesDemoFilter = 
      !demoActive || alert.locationName.toLowerCase().includes("mumbai");

    return matchesSeverity && matchesStatus && matchesDemoFilter;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full font-mono">
        
        {/* Title */}
        <div className="pb-4 border-b border-zinc-900">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">// LIVE ADVISORY BROADCAST MODULE</h2>
        </div>

        {/* Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Broadcast form */}
          <form 
            onSubmit={handleBroadcast}
            className="lg:col-span-1 bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-4 relative z-10"
          >
            <div className="flex items-center gap-2 text-rose-500 pb-2 border-b border-zinc-900">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Broadcast Advisory</h3>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Threat Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sion-Panvel Waterlogging"
                className="bg-zinc-950 border border-zinc-850 focus:border-rose-500 rounded px-3 py-2 text-xs text-zinc-250 focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Description Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Evacuation perimeters, weather warnings..."
                rows={3}
                className="bg-zinc-950 border border-zinc-850 focus:border-rose-500 rounded px-3 py-2 text-xs text-zinc-250 focus:outline-none transition-all resize-none leading-relaxed font-sans"
              />
            </div>

            {/* Category & Severity Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="bg-zinc-950 border border-zinc-850 focus:border-rose-500 text-xs text-zinc-300 rounded px-2.5 py-1.5 focus:outline-none transition-all"
                >
                  <option value="Flood">Flood</option>
                  <option value="Fire">Fire</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Disease">Disease</option>
                  <option value="Weather">Weather</option>
                  <option value="Seismic">Seismic</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Severity</label>
                <select
                  value={severity}
                  onChange={(e: any) => setSeverity(e.target.value)}
                  className="bg-zinc-950 border border-zinc-850 focus:border-rose-500 text-xs text-zinc-350 rounded px-2.5 py-1.5 focus:outline-none transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Target Area Preset */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Target Region</label>
              <select
                value={selectedPresetIdx}
                onChange={(e) => setSelectedPresetIdx(parseInt(e.target.value))}
                className="bg-zinc-950 border border-zinc-850 focus:border-rose-500 text-xs text-zinc-300 rounded px-2.5 py-1.5 focus:outline-none transition-all"
                disabled={demoActive}
              >
                {LOCATION_PRESETS.map((preset, idx) => (
                  <option key={preset.name} value={idx}>{preset.name}</option>
                ))}
              </select>
            </div>

            {formError && (
              <span className="text-[10px] text-rose-400 font-semibold">{formError}</span>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              {formSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>TRANSMITTED</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>BROADCAST_ALERT</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Alerts Feed List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Filter controls */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between backdrop-blur-sm relative z-10">
              <div className="flex items-center gap-2 text-zinc-500">
                <Filter className="w-4 h-4 text-zinc-650" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Filter streams:</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-zinc-950 text-zinc-400 border border-zinc-850 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">ALL_SEVERITY</option>
                  <option value="critical">CRITICAL</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-zinc-950 text-zinc-400 border border-zinc-850 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">ALL_STATUS</option>
                  <option value="active">ACTIVE_ONLY</option>
                  <option value="resolved">RESOLVED_ONLY</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            {loading ? (
              <div className="flex justify-center items-center py-20 font-mono text-xs text-zinc-550 animate-pulse">
                QUERYING_ACTIVE_ADVISORIES_INDEX...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="bg-zinc-950/60 border border-zinc-900 p-10 rounded-xl text-center text-zinc-550">
                <ShieldCheck className="w-10 h-10 text-zinc-850 mx-auto mb-3" />
                <h4 className="text-xs font-bold text-zinc-400">NO_ADVISORIES_REGISTERED</h4>
                <p className="text-[10px] mt-1 text-zinc-550">Radar sweep signals nominal status.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !alert.active ? "bg-zinc-950/20 border-zinc-900/40 opacity-50" :
                      alert.severity === "critical" ? "bg-rose-950/10 border-rose-900/50 hover:bg-rose-950/15" :
                      alert.severity === "high" ? "bg-orange-950/10 border-orange-900/50 hover:bg-orange-950/15" :
                      alert.severity === "medium" ? "bg-amber-950/10 border-amber-900/50 hover:bg-amber-950/15" :
                      "bg-zinc-900/20 border-zinc-850 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex-1 space-y-1.5 text-[10px]">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          alert.severity === "critical" ? "bg-rose-500 text-zinc-950 animate-alert-blink" :
                          alert.severity === "high" ? "bg-orange-500 text-zinc-950" :
                          alert.severity === "medium" ? "bg-amber-500 text-zinc-950" : "bg-emerald-500 text-zinc-950"
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-700" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </span>
                        <span className="text-[9px] text-zinc-400 bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 rounded font-mono">
                          {alert.category}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-xs text-white leading-tight">{alert.title}</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl font-sans">{alert.description}</p>
                      
                      <div className="text-[9px] text-zinc-550 font-mono flex items-center gap-1.5 pt-1 border-t border-zinc-900/40">
                        <MapPin className="w-3.5 h-3.5 text-zinc-800" />
                        <span>SECTOR: {alert.locationName} (LAT: {alert.lat.toFixed(4)}, LNG: {alert.lng.toFixed(4)})</span>
                      </div>
                    </div>

                    {/* Resolve button action */}
                    {alert.active ? (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="self-start sm:self-center flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-350 hover:text-white rounded text-xs font-bold transition-all shrink-0 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        <span>RESOLVE</span>
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>RESOLVED</span>
                      </span>
                    )}

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
