"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { EmergencyAlert, ReliefCamp, EvacuationRoute } from "@/lib/mockData";

// Fix Leaflet assets loading issues
import "leaflet/dist/leaflet.css";

// Dynamic view update helper
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcons styled with Tailwind
const createAlertIcon = (severity: "low" | "medium" | "high" | "critical") => {
  let color = "bg-emerald-500";
  let animate = "";
  if (severity === "medium") color = "bg-amber-500";
  if (severity === "high") color = "bg-orange-600";
  if (severity === "critical") {
    color = "bg-rose-600";
    animate = "animate-ping";
  }

  return L.divIcon({
    html: `<div class="relative flex items-center justify-center w-6 h-6">
      <span class="absolute inline-flex h-full w-full rounded-full ${color} opacity-75 ${animate}"></span>
      <span class="relative inline-flex rounded-full h-3.5 w-3.5 ${color} border-2 border-slate-900 shadow-lg"></span>
    </div>`,
    className: "custom-marker-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createCampIcon = (status: "open" | "filling" | "full" | "closed") => {
  let color = "bg-sky-500";
  if (status === "filling") color = "bg-indigo-500";
  if (status === "full") color = "bg-violet-600";
  if (status === "closed") color = "bg-slate-500";

  return L.divIcon({
    html: `<div class="relative flex items-center justify-center w-6 h-6">
      <span class="absolute inline-flex h-5 w-5 rounded-md ${color} opacity-20"></span>
      <span class="relative inline-flex rounded-md h-3 w-3 ${color} border-2 border-slate-950 shadow-md"></span>
    </div>`,
    className: "custom-camp-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapProps {
  center: [number, number];
  zoom: number;
  alerts?: EmergencyAlert[];
  camps?: ReliefCamp[];
  routes?: EvacuationRoute[];
  simulationData?: {
    lat: number;
    lng: number;
    radius: number; // in meters
    type: "Flood" | "Fire" | "Landslide" | "Disease";
    severity: string;
  } | null;
}

export default function Map({ center, zoom, alerts = [], camps = [], routes = [], simulationData = null }: MapProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={center} zoom={zoom} />

        {/* Render Emergency Alerts */}
        {alerts.map((alert) => (
          <Marker
            key={`${alert.id}-${alert.severity}-${alert.active}`}
            position={[alert.lat, alert.lng]}
            icon={createAlertIcon(alert.severity)}
          >
            <Popup className="dark-popup">
              <div className="p-1 text-slate-100 min-w-[150px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.severity === "critical" ? "bg-rose-500/20 text-rose-400" :
                    alert.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                    alert.severity === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">{alert.category}</span>
                </div>
                <h4 className="font-semibold text-sm text-white">{alert.title}</h4>
                <p className="text-xs mt-1 text-slate-300 leading-relaxed">{alert.description}</p>
                <div className="text-[10px] mt-2 text-slate-500 font-mono">Loc: {alert.locationName}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Relief Camps */}
        {camps.map((camp) => (
          <Marker
            key={`${camp.id}-${camp.status}-${camp.occupancy}`}
            position={[camp.lat, camp.lng]}
            icon={createCampIcon(camp.status)}
          >
            <Popup className="dark-popup">
              <div className="p-1 text-slate-100 min-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-400 font-mono">RELIEF CAMP</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    camp.status === "open" ? "bg-emerald-500/20 text-emerald-400" :
                    camp.status === "filling" ? "bg-indigo-500/20 text-indigo-400" :
                    camp.status === "full" ? "bg-violet-500/20 text-violet-400" : "bg-zinc-500/20 text-zinc-400"
                  }`}>
                    {camp.status}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-white">{camp.name}</h4>
                <p className="text-xs mt-0.5 text-zinc-400">{camp.address}</p>
                
                <div className="mt-2 text-xs space-y-1 bg-zinc-900/60 p-1.5 rounded border border-zinc-800">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-semibold text-white">{camp.occupancy} / {camp.capacity}</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        camp.occupancy / camp.capacity > 0.9 ? "bg-violet-500" : "bg-sky-500"
                      }`}
                      style={{ width: `${(camp.occupancy / camp.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-center">
                    <div className="rounded bg-zinc-900 p-0.5">
                      <span className="block text-zinc-500">Water</span>
                      <span className={`font-semibold capitalize ${
                        camp.supplies.water === "high" ? "text-emerald-400" :
                        camp.supplies.water === "medium" ? "text-sky-400" : "text-rose-400"
                      }`}>{camp.supplies.water}</span>
                    </div>
                    <div className="rounded bg-zinc-900 p-0.5">
                      <span className="block text-zinc-500">Food</span>
                      <span className={`font-semibold capitalize ${
                        camp.supplies.food === "high" ? "text-emerald-400" :
                        camp.supplies.food === "medium" ? "text-sky-400" : "text-rose-400"
                      }`}>{camp.supplies.food}</span>
                    </div>
                    <div className="rounded bg-zinc-900 p-0.5">
                      <span className="block text-zinc-500">Med</span>
                      <span className={`font-semibold capitalize ${
                        camp.supplies.medical === "high" ? "text-emerald-400" :
                        camp.supplies.medical === "medium" ? "text-sky-400" : "text-rose-400"
                      }`}>{camp.supplies.medical}</span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] mt-2 text-zinc-500 font-mono">Tel: {camp.contact}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Evacuation Routes */}
        {routes.map((route) => {
          let color = "#10b981"; // Safe - Green
          if (route.safetyRating < 85 && route.safetyRating >= 60) color = "#f59e0b"; // Caution - Orange
          if (route.safetyRating < 60) color = "#ef4444"; // Hazard - Red

          return (
            <Polyline
              key={route.id}
              positions={route.polyline}
              pathOptions={{
                color,
                weight: route.type === "primary" ? 5 : 3,
                opacity: 0.85,
                dashArray: route.type === "alternate" ? "8, 8" : undefined,
              }}
            >
              <Popup>
                <div className="p-1 text-slate-100 min-w-[150px]">
                  <h4 className="font-semibold text-sm text-white">{route.name}</h4>
                  <div className="text-xs text-zinc-400 mt-1 flex justify-between">
                    <span>Distance: {route.distanceKm} km</span>
                    <span>Time: {route.durationMins} mins</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      route.safetyRating >= 85 ? "bg-emerald-500/20 text-emerald-400" :
                      route.safetyRating >= 60 ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {route.safetyRating}% SAFETY
                    </span>
                  </div>
                  {route.hazardReason && (
                    <p className="text-[10px] text-rose-300 mt-1.5 italic bg-rose-950/20 border border-rose-900/50 p-1 rounded">
                      ⚠️ {route.hazardReason}
                    </p>
                  )}
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render Scenario Simulation Damage Area */}
        {simulationData && (
          <Circle
            key={`sim-circle-${simulationData.lat}-${simulationData.lng}-${simulationData.radius}-${simulationData.type}`}
            center={[simulationData.lat, simulationData.lng]}
            radius={simulationData.radius}
            pathOptions={{
              color: 
                simulationData.type === "Flood" ? "#06b6d4" :
                simulationData.type === "Fire" ? "#f97316" :
                simulationData.type === "Landslide" ? "#84cc16" : "#ec4899",
              fillColor:
                simulationData.type === "Flood" ? "#06b6d4" :
                simulationData.type === "Fire" ? "#f97316" :
                simulationData.type === "Landslide" ? "#84cc16" : "#ec4899",
              fillOpacity: 0.2,
              weight: 2,
              dashArray: "4, 4",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
