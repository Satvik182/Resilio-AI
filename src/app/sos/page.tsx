"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { EMERGENCY_CONTACTS } from "@/lib/mockData";
import {
  Flame,
  Radio,
  MapPin,
  Clock,
  Compass,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Terminal
} from "lucide-react";

export default function SOSPage() {
  const [sosActive, setSosActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("Mumbai, MH (Kurla Corridor)");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 });
  const [regionFilter, setRegionFilter] = useState("all");
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
    setDemoActive(isDemo);
    if (isDemo) {
      setCoords({ lat: 19.0760, lng: 72.8777 });
      setLocationName("Mumbai, MH (Kurla Corridor)");
      setRegionFilter("Mumbai");
    } else {
      setCoords({ lat: 19.0760, lng: 72.8777 });
      setRegionFilter("Mumbai");
    }
  }, []);

  const triggerSOS = async () => {
    setLoading(true);
    setSosActive(false);

    if (!demoActive && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName(`Browser GPS Coordinates`);
        },
        (error) => {
          console.warn("Geolocation denied, using tactical fallback coordinates.");
        }
      );
    }

    setTimeout(async () => {
      setLoading(false);
      setSosActive(true);

      // Create an automatic critical alert in the database alerts list!
      try {
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "CRITICAL: SOS Beacon Activated",
            description: "An emergency SOS distress beacon was broadcast from a civilian terminal. Immediate assistance requested.",
            severity: "critical",
            category: "Seismic",
            locationName: locationName,
            lat: coords.lat + (Math.random() - 0.5) * 0.01,
            lng: coords.lng + (Math.random() - 0.5) * 0.01
          })
        });
      } catch (err) {
        console.error("Failed to append SOS alert:", err);
      }
    }, 2000);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
  };

  const filteredContacts = EMERGENCY_CONTACTS.filter(contact => 
    regionFilter === "all" || contact.region.toLowerCase().includes(regionFilter.toLowerCase()) || contact.region === "National"
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full font-mono">
        
        {/* Header Title */}
        <div className="pb-4 border-b border-zinc-900">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">// EMERGENCY SOS PROTOCOL</h2>
        </div>

        {/* SOS Panel Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Panel: Trigger SOS (2 cols) */}
          <div className="lg:col-span-2 bg-zinc-950/60 border border-zinc-900 p-6 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[420px]">
            
            {/* Background scanner circles */}
            {sosActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] rounded-full border border-rose-500/20 animate-ping absolute"></div>
                <div className="w-[450px] h-[450px] rounded-full border border-rose-500/10 animate-ping absolute duration-1000"></div>
              </div>
            )}

            {!sosActive && !loading ? (
              /* Ready State */
              <div className="flex flex-col items-center z-10 max-w-md">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-6 animate-pulse">
                  <ShieldAlert className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 uppercase">// DISTRESS BEACON ACTUATOR</h3>
                <p className="text-[11px] text-zinc-550 mb-8 leading-relaxed font-sans">
                  Triggering the SOS button will broadcast a mock critical incident report, upload your GPS coordinates, and add a flashing red marker to the Tactical Map.
                </p>

                {/* Big pulsating button */}
                <button
                  onClick={triggerSOS}
                  className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 border-[6px] border-zinc-950 shadow-2xl shadow-rose-600/30 flex flex-col items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95 group select-none cursor-pointer"
                >
                  <Flame className="w-10 h-10 text-white animate-pulse" />
                  <span className="text-white text-[10px] font-black tracking-widest font-mono uppercase">TRIGGER SOS</span>
                </button>
              </div>
            ) : loading ? (
              /* Loading Transmission */
              <div className="flex flex-col items-center justify-center z-10">
                <div className="w-16 h-16 border-4 border-t-rose-500 border-zinc-800 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xs font-bold text-zinc-200 font-mono tracking-widest uppercase animate-pulse">
                  TRANSMITTING_SOS_BEACON...
                </h3>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                  Accessing browser geolocation and binding encryption parameters.
                </p>
              </div>
            ) : (
              /* SOS Active State */
              <div className="flex flex-col items-center z-10 max-w-md">
                <div className="w-12 h-12 rounded-full bg-rose-500/25 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-6 animate-pulse">
                  <Radio className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-sm font-black text-rose-500 tracking-wider uppercase mb-1">
                  SOS BEACON BROADCAST ACTIVE
                </h3>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono font-bold mb-6">
                  Emergency response networks notified
                </span>

                <div className="bg-zinc-950/80 p-4 rounded border border-rose-950/40 text-left w-full space-y-2 mb-8 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                    <span className="text-zinc-500">BEACON_ID</span>
                    <span className="text-zinc-200 font-bold">BEAC-8849-IN</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                    <span className="text-zinc-500">COORDINATES</span>
                    <span className="text-rose-400 font-bold">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">TACTICAL_LOCATION</span>
                    <span className="text-zinc-200 truncate max-w-[180px]">{locationName}</span>
                  </div>
                </div>

                <button
                  onClick={handleCancelSOS}
                  className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-zinc-355 rounded text-[10px] font-bold transition-all uppercase tracking-wide cursor-pointer"
                >
                  Cancel Broadcast
                </button>
              </div>
            )}

          </div>

          {/* Right Panel: Emergency helplines directories (1 col) */}
          <div className="lg:col-span-1 bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl backdrop-blur-sm flex flex-col gap-4">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span>Emergency Directory</span>
              </h3>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-zinc-950 text-zinc-400 border border-zinc-850 rounded text-[9px] font-bold uppercase px-2 py-1 focus:outline-none focus:border-teal-500"
              >
                <option value="all">ALL_SECTORS</option>
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">Delhi</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>

            {/* Helpline lists */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {filteredContacts.map((contact, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-zinc-950/80 border border-zinc-900 rounded flex items-center justify-between gap-2 hover:border-zinc-850 transition-colors text-[10px]"
                >
                  <div>
                    <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest font-mono">
                      {contact.region}
                    </span>
                    <h5 className="font-bold text-zinc-200 leading-tight mt-0.5">{contact.title}</h5>
                    <span className="text-[8px] text-zinc-500 font-mono block mt-0.5">{contact.availability}</span>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:border-teal-500/50 hover:bg-teal-500/20 rounded text-[9px] font-bold font-mono transition-all shrink-0 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 fill-teal-400/20" />
                    <span>DIAL</span>
                  </a>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}
