"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Map from "@/components/map";
import { ReliefCamp } from "@/lib/mockData";
import {
  Home,
  MapPin,
  HeartHandshake,
  Users,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Phone,
  Terminal
} from "lucide-react";

export default function CampsPage() {
  const [camps, setCamps] = useState<ReliefCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]); // default Mumbai
  const [mapZoom, setMapZoom] = useState(12);
  const [demoActive, setDemoActive] = useState(false);

  const fetchCamps = async () => {
    try {
      const res = await fetch("/api/camps");
      if (res.ok) {
        const data = await res.json();
        setCamps(data);
        if (data.length > 0) {
          // If demo active, focus on the first Mumbai camp (BKC MMDA Grounds)
          const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
          if (isDemo) {
            const bkc = data.find((c: ReliefCamp) => c.name.includes("BKC"));
            if (bkc) {
              setMapCenter([bkc.lat, bkc.lng]);
              setMapZoom(13);
              return;
            }
          }
          setMapCenter([data[0].lat, data[0].lng]);
        }
      }
    } catch (err) {
      console.error("Failed to load camps list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
    setDemoActive(isDemo);
    if (isDemo) {
      setMapCenter([19.0760, 72.8777]);
    }
    fetchCamps();
  }, []);

  const handleUpdateOccupancy = async (id: string, currentOccupancy: number, diff: number) => {
    const newOccupancy = Math.max(0, currentOccupancy + diff);
    try {
      const res = await fetch("/api/camps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateOccupancy",
          id,
          occupancy: newOccupancy
        })
      });
      if (res.ok) {
        await fetchCamps();
      }
    } catch (err) {
      console.error("Failed to update camp occupancy:", err);
    }
  };

  const handleFocusCamp = (camp: ReliefCamp) => {
    setMapCenter([camp.lat, camp.lng]);
    setMapZoom(14);
  };

  // Filter camps to only show Mumbai camps if in demo mode
  const filteredCamps = camps.filter(camp => {
    if (demoActive) {
      return camp.address.includes("Mumbai") || camp.name.includes("Mumbai") || camp.address.includes("Thane");
    }
    return true;
  });

  // Find camp with lowest occupancy percentage that has status "open"
  const recommendedCamp = filteredCamps
    .filter(c => c.status === "open")
    .sort((a, b) => (a.occupancy / a.capacity) - (b.occupancy / b.capacity))[0];

  const getSupplyColor = (level: string) => {
    if (level === "high") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
    if (level === "medium") return "text-sky-400 bg-sky-500/10 border-sky-500/25";
    if (level === "low") return "text-amber-400 bg-amber-500/10 border-amber-500/25 font-bold";
    return "text-rose-400 bg-rose-500/10 border-rose-500/25 font-black animate-pulse";
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full gap-6 font-mono">
        
        {/* Header Title */}
        <div className="pb-4 border-b border-zinc-900">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">// HUMANITARIAN RELIEF SHELTERS INDEX</h2>
        </div>

        {/* Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          
          {/* Sidebar (1 col) */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto max-h-[650px] pr-2">
            
            {/* Recommended Shelter recommendation */}
            {recommendedCamp && (
              <div className="bg-teal-950/10 border border-teal-500/30 p-4 rounded-xl flex gap-3 relative overflow-hidden group">
                <div className="w-9 h-9 rounded bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </div>
                <div className="text-[10px]">
                  <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider font-mono">// DISPATCH_ADVISORY</span>
                  <h4 className="font-bold text-zinc-200 mt-0.5 leading-snug">{recommendedCamp.name}</h4>
                  <p className="text-zinc-400 leading-normal mt-1 font-sans text-[11px]">
                    Reports lowest capacity strain ({(Math.round((recommendedCamp.occupancy / recommendedCamp.capacity) * 100))}%). Directing new evacuations here is recommended.
                  </p>
                  <button
                    onClick={() => handleFocusCamp(recommendedCamp)}
                    className="flex items-center gap-1 text-[9px] font-bold text-teal-400 mt-2 hover:text-teal-300 font-mono"
                  >
                    <span>PLOT_ON_MAP</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* List of camps */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-zinc-500" />
                  <span>Facility Registries</span>
                </h3>
              </div>

              {loading ? (
                <div className="py-10 text-center font-mono text-xs text-zinc-550">
                  REFRESHING_SHELTERS_DATA...
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCamps.map((camp) => (
                    <div 
                      key={camp.id}
                      className="p-4 bg-zinc-950/80 border border-zinc-900 rounded flex flex-col gap-3 transition-all hover:bg-zinc-900/20"
                    >
                      {/* Name, Status, Focus link */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="text-[10px]">
                          <button
                            onClick={() => handleFocusCamp(camp)}
                            className="font-bold text-zinc-200 text-left hover:text-teal-400 transition-colors uppercase leading-snug"
                          >
                            {camp.name}
                          </button>
                          <span className="text-[9px] text-zinc-500 block mt-0.5 leading-tight">{camp.address}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                          camp.status === "open" ? "bg-emerald-500/25 text-emerald-400" :
                          camp.status === "filling" ? "bg-indigo-500/25 text-indigo-400" :
                          camp.status === "full" ? "bg-violet-500/25 text-violet-400" : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {camp.status}
                        </span>
                      </div>

                      {/* Occupancy tracker with +/- Simulation controls */}
                      <div className="space-y-2 bg-zinc-900/20 p-2.5 rounded border border-zinc-900 flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[8px] text-zinc-500">
                            <Users className="w-3.5 h-3.5" />
                            <span>Evacuee Registry</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateOccupancy(camp.id, camp.occupancy, -100)}
                              className="p-1 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-white"
                              title="Simulate 100 departures"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-zinc-300 font-semibold">{camp.occupancy} / {camp.capacity}</span>
                            <button
                              onClick={() => handleUpdateOccupancy(camp.id, camp.occupancy, 100)}
                              className="p-1 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-white"
                              title="Simulate 100 arrivals"
                              disabled={camp.occupancy >= camp.capacity}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded overflow-hidden border border-zinc-900">
                          <div
                            className={`h-full rounded-none ${
                              camp.occupancy / camp.capacity > 0.9 ? "bg-violet-500" : "bg-sky-500"
                            }`}
                            style={{ width: `${(camp.occupancy / camp.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Supply Levels indicators */}
                      <div className="grid grid-cols-3 gap-2 text-[8px] text-center font-mono">
                        <div className={`p-1.5 rounded border ${getSupplyColor(camp.supplies.water)}`}>
                          <span className="block text-[7px] text-zinc-500 font-bold uppercase tracking-wider">Water</span>
                          <span className="font-bold uppercase">{camp.supplies.water}</span>
                        </div>
                        <div className={`p-1.5 rounded border ${getSupplyColor(camp.supplies.food)}`}>
                          <span className="block text-[7px] text-zinc-500 font-bold uppercase tracking-wider">Food</span>
                          <span className="font-bold uppercase">{camp.supplies.food}</span>
                        </div>
                        <div className={`p-1.5 rounded border ${getSupplyColor(camp.supplies.medical)}`}>
                          <span className="block text-[7px] text-zinc-500 font-bold uppercase tracking-wider">Med</span>
                          <span className="font-bold uppercase">{camp.supplies.medical}</span>
                        </div>
                      </div>

                      <div className="text-[9px] text-zinc-500 font-mono flex items-center gap-1.5 pt-1 border-t border-zinc-900/40">
                        <Phone className="w-3 h-3 text-zinc-700" />
                        <span>HOTLINE: {camp.contact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Map Column (2 cols) */}
          <div className="lg:col-span-2 flex flex-col h-[400px] lg:h-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 border-t border-x border-zinc-800 rounded-t-xl text-[9px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span>TACTICAL SHELTER MARKERS STREAMING LIVE</span>
            </div>
            <div className="flex-1 min-h-[400px]">
              <Map
                center={mapCenter}
                zoom={mapZoom}
                camps={filteredCamps}
              />
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
