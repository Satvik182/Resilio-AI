"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Map from "@/components/map";
import { MOCK_ROUTES, EvacuationRoute } from "@/lib/mockData";
import {
  Route,
  Clock,
  Compass,
  CheckCircle,
  Play,
  RotateCcw,
  Navigation,
  Terminal,
  AlertTriangle
} from "lucide-react";

const PRESET_CITIES = [
  { name: "Mumbai, MH", center: [19.0760, 72.8777] as [number, number], zoom: 12 },
  { name: "New Delhi, DL", center: [28.6139, 77.2090] as [number, number], zoom: 12 }
];

export default function RoutesPage() {
  const [cityIdx, setCityIdx] = useState(0);
  const [startPoint, setStartPoint] = useState("Kurla West Junction");
  const [endPoint, setEndPoint] = useState("BKC Ground Center");
  const [calculated, setCalculated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-mum-1");
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
    setDemoActive(isDemo);
    if (isDemo) {
      setCityIdx(0); // Mumbai
      setSelectedRouteId("route-mum-1");
      setStartPoint("Kurla West Junction");
      setEndPoint("BKC Ground Center");
    } else {
      setCityIdx(0);
      setSelectedRouteId("route-mum-1");
    }
  }, []);

  const city = PRESET_CITIES[cityIdx] || PRESET_CITIES[0];
  const routes = MOCK_ROUTES[city.name] || [];
  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCalculated(true);
      const cityRoutes = MOCK_ROUTES[city.name] || [];
      if (cityRoutes.length > 0) {
        setSelectedRouteId(cityRoutes[0].id);
      }
    }, 1200);
  };

  const handleCityChange = (idx: number) => {
    if (demoActive) return; // Locked in demo mode
    setCityIdx(idx);
    const newCity = PRESET_CITIES[idx];
    const newRoutes = MOCK_ROUTES[newCity.name] || [];
    if (newRoutes.length > 0) {
      setSelectedRouteId(newRoutes[0].id);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full gap-6 font-mono">
        
        {/* Header Title */}
        <div className="pb-4 border-b border-zinc-900">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">// EVACUATION CORRIDOR PLOTTING ENGINE</h2>
        </div>

        {/* Form controls */}
        <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">CHOOSE_SECTOR:</span>
            <div className="flex gap-2">
              {PRESET_CITIES.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => handleCityChange(idx)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    cityIdx === idx
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/40 font-bold"
                      : "bg-zinc-950/40 text-zinc-550 border-zinc-850 hover:border-zinc-750 hover:text-zinc-350"
                  } ${demoActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={demoActive}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-1 max-w-lg lg:justify-end">
            <div className="w-full sm:w-auto">
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="Start point"
                className="bg-zinc-950 border border-zinc-850 focus:border-teal-500 text-xs text-zinc-350 rounded px-3 py-2 w-full focus:outline-none"
                disabled={loading}
              />
            </div>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="End point"
                className="bg-zinc-950 border border-zinc-850 focus:border-teal-500 text-xs text-zinc-350 rounded px-3 py-2 w-full focus:outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow shrink-0 cursor-pointer"
              disabled={loading}
            >
              <Navigation className="w-3.5 h-3.5 fill-zinc-950" />
              <span>PLOT</span>
            </button>
          </form>
        </div>

        {/* Split view workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
          
          {/* Sidebar Columns (1 col) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Calculated Corridor Options */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl backdrop-blur-sm flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white pb-2.5 border-b border-zinc-900 flex items-center gap-2">
                <Route className="w-4 h-4 text-zinc-500" />
                <span>Calculated Safe Corridors</span>
              </h3>

              {loading ? (
                <div className="py-10 text-center font-mono text-[10px] text-zinc-500 animate-pulse">
                  CALCULATING_OBSTRUCTION_RATING...
                </div>
              ) : !calculated ? (
                <div className="py-10 text-center text-zinc-550 text-xs">
                  INPUT_START_COORDINATES
                </div>
              ) : (
                <div className="space-y-3">
                  {routes.map((route) => {
                    const isSelected = selectedRouteId === route.id;
                    return (
                      <button
                        key={route.id}
                        onClick={() => setSelectedRouteId(route.id)}
                        className={`w-full p-3.5 rounded border text-left flex flex-col gap-2 transition-all ${
                          isSelected
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/40 shadow-sm"
                            : "bg-zinc-950/40 text-zinc-500 border-zinc-850 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full text-[10px]">
                          <h4 className="font-bold text-zinc-200">{route.name}</h4>
                        </div>

                        <div className="flex items-center gap-3 text-[9px] text-zinc-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-700" />
                            <span>{route.durationMins} MINS</span>
                          </span>
                          <span>{route.distanceKm} KM</span>
                        </div>

                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Safety instructions */}
            <div className="bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-xl flex flex-col gap-3 text-[10px] text-zinc-500 leading-relaxed">
              <h4 className="font-bold text-zinc-350">// CORRIDOR_DISPATCH_GUIDELINES</h4>
              <div className="space-y-2.5 font-sans text-[11px]">
                <p>• Avoid routes routed via LBS Marg due to high river backflow.</p>
                <p>• Emergency services prioritize Sion-Panvel safe lanes.</p>
              </div>
            </div>

          </div>

          {/* Map Column (2 cols) */}
          <div className="lg:col-span-2 flex flex-col h-[400px] lg:h-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 border-t border-x border-zinc-800 rounded-t-xl text-[9px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <span>TACTICAL ROUTING LAYERS ENGAGED // {city.name}</span>
            </div>
            <div className="flex-1 min-h-[400px]">
              <Map
                center={city.center}
                zoom={city.zoom}
                routes={routes}
              />
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
