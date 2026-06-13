"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radio,
  ArrowRight,
  ShieldAlert,
  Play,
  AlertTriangle,
  Compass,
  Zap,
  Globe,
  Bell,
  Terminal,
  Activity,
  HeartHandshake,
  Database
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [tickerIndex, setTickerIndex] = useState(0);

  const tickerAlerts = [
    "CRITICAL // MUMBAI METROPOLITAN AREA FLASH FLOOD WARNING // MITHI RIVER BREACHED SAFETY LIMITS",
    "ALERT // LANDSLIDE RISK IN HIMACHAL PRADESH // GEOTECHNICAL SENSORS REPORT HIGH CREEP RATE",
    "WARNING // BAY OF BENGAL CYCLONE FORMATIONS // HEAVY RAINFALL ALERT ACTIVE IN CHENNAI SECTOR",
    "ADVISORY // YAMUNA RIVER WATER LEVEL MONITORING // DISCHARGE BARRIER AUDITS UNDERWAY IN DELHI"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerAlerts.length]);

  const launchJudgeAutopilot = () => {
    localStorage.setItem("resilio_demo_mode", "mumbai");
    localStorage.setItem("resilio_judge_mode_stage", "1"); // Stage 1 start
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col relative overflow-hidden font-mono hud-grid hud-scanline">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Radio className="w-5 h-5 text-zinc-950 animate-pulse" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white tracking-tighter leading-none">RESILIO AI</h1>
            <p className="text-[9px] text-teal-400 font-bold uppercase tracking-widest mt-0.5">Tactical Command</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={launchJudgeAutopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-black uppercase tracking-widest transition-all animate-pulse cursor-pointer border border-rose-500"
          >
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Judge Demo Mode</span>
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded text-xs font-black uppercase tracking-wider transition-all"
          >
            LAUNCH_CONSOLE
          </Link>
        </div>
      </header>

      {/* Live Alert Ticker */}
      <div className="bg-rose-950/20 border-b border-rose-900/40 px-6 py-2 flex items-center gap-3 text-rose-400 text-[10px] font-bold uppercase tracking-wider relative z-10">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
        <span className="font-black text-[9px] border border-rose-500/30 px-1 rounded bg-rose-950/40 font-mono shrink-0">CRITICAL_FEED</span>
        <div className="flex-1 overflow-hidden h-4">
          <p className="animate-fade-in-up font-mono truncate">{tickerAlerts[tickerIndex]}</p>
        </div>
      </div>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto px-6 py-12 lg:py-24 flex-1">
        
        {/* Left Side Info */}
        <div className="flex-1 text-left space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded bg-teal-950/20 font-mono tracking-widest uppercase">
            <span>EOC // COMMAND NODE V2.0</span>
          </div>

          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-white leading-[0.95]">
            Resilio AI
          </h2>

          <h3 className="text-base sm:text-lg text-teal-400 font-bold uppercase tracking-wide leading-relaxed">
            AI-Powered Disaster Prediction, Simulation & Emergency Response
          </h3>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
            An advanced crisis control dashboard designed to run real-time risk assessment scans, simulate hazard spread corridors (flood water levels, wildfire perimeters), and map optimized safety routes.
          </p>

          {/* Primary & Secondary CTA */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={launchJudgeAutopilot}
              className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 border border-rose-500 animate-pulse cursor-pointer"
            >
              <span>Judge Demo Mode</span>
              <Terminal className="w-4 h-4 text-white" />
            </button>
            <Link
              href="/risk-assessment"
              className="flex items-center gap-2 px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-xs text-zinc-300 font-bold uppercase tracking-widest transition-all"
            >
              <span>Launch Simulation</span>
            </Link>
          </div>
        </div>

        {/* Right Side: India Hotspot Grid Map */}
        <div className="w-full lg:w-[480px] h-[480px] shrink-0 border border-zinc-850 bg-black/60 rounded-2xl relative p-5 flex flex-col justify-between overflow-hidden shadow-2xl shadow-zinc-950/80">
          <div className="absolute inset-0 radar-sweep rounded-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start text-[8px] text-zinc-500 font-mono relative z-10 border-b border-zinc-900 pb-2">
            <span>GRID_SOURCE: NATIONAL_SATELLITE_FEED</span>
            <span>RADAR_SWEEP_ACTIVE</span>
          </div>

          {/* SVG Map of India Coastline/Grid Abstract */}
          <div className="flex-1 w-full flex items-center justify-center relative my-4">
            <svg viewBox="0 0 400 450" className="w-full h-full max-h-[350px] opacity-75">
              <path 
                d="M 170 30 L 220 50 L 240 90 L 260 130 L 290 150 L 330 180 L 300 220 L 280 230 L 270 250 L 240 270 L 220 300 L 210 330 L 205 370 L 200 390 L 195 370 L 185 340 L 175 320 L 165 300 L 150 280 L 130 250 L 125 210 L 130 180 L 110 160 L 90 150 L 80 170 L 60 160 L 95 120 L 115 100 L 145 90 L 155 70 Z" 
                fill="none" 
                stroke="rgba(20, 184, 166, 0.15)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />
              
              {/* Heatmap rings representing risk perimeters */}
              <circle cx="125" cy="220" r="18" fill="rgba(244, 63, 94, 0.08)" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="125" cy="220" r="28" fill="none" stroke="rgba(244, 63, 94, 0.1)" strokeWidth="1" />
              
              {/* Hotspot Markers (Pulsing glowing dots) */}
              {/* 1. Mumbai (Blinking Red) */}
              <g className="animate-pulse">
                <circle cx="125" cy="220" r="6" fill="#f43f5e" />
                <circle cx="125" cy="220" r="14" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" />
              </g>
              <text x="138" y="223" fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace">MUMBAI [CRITICAL]</text>

              {/* 2. New Delhi (Blinking Yellow) */}
              <g className="opacity-80">
                <circle cx="165" cy="90" r="4" fill="#fbbf24" />
              </g>
              <text x="175" y="93" fill="#fbbf24" fontSize="8" fontFamily="monospace">DELHI [STANDBY]</text>

              {/* 3. Chennai */}
              <g className="opacity-80 animate-pulse">
                <circle cx="178" cy="365" r="4.5" fill="#fbbf24" />
              </g>
              <text x="188" y="368" fill="#fbbf24" fontSize="8" fontFamily="monospace">CHENNAI [WARNING]</text>

              {/* 4. Kolkata */}
              <g className="opacity-80">
                <circle cx="280" cy="180" r="4" fill="#14b8a6" />
              </g>
              <text x="290" y="183" fill="#14b8a6" fontSize="8" fontFamily="monospace">KOLKATA [OK]</text>

              {/* 5. Bengaluru */}
              <g className="opacity-85">
                <circle cx="175" cy="310" r="4" fill="#14b8a6" />
              </g>
              <text x="185" y="313" fill="#14b8a6" fontSize="8" fontFamily="monospace">BENGALURU [OK]</text>
            </svg>
          </div>

          <div className="flex justify-between items-center text-[8px] text-zinc-500 border-t border-zinc-900 pt-2 font-mono">
            <span>GRID_SECURE: LOCK_GEO</span>
            <span>BEACON_PING_ACTIVE</span>
          </div>
        </div>

      </section>

      {/* SECTION 2: INTERACTIVE DISASTER SIMULATION PREVIEW */}
      <section className="bg-black/40 border-y border-zinc-900 py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-4">
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider font-mono">// FLAGSHIP CAPABILITY</span>
            <h3 className="text-3xl font-black text-white tracking-tighter">Emergency Operations Center Modeling</h3>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans">
              Resilio AI allows operations coordinators to model flooding spreads or wildfire boundaries dynamically. An interactive timeline scrubber advances the disaster timeline to forecast changing population impacts, damaged infrastructure grids, and pre-allocate truck supplies.
            </p>
            <div className="pt-2">
              <Link
                href="/risk-assessment"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 font-mono uppercase tracking-widest"
              >
                <span>OPEN_SIMULATION_ROOM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Graphical Frame preview of the console */}
          <div className="w-full md:w-[420px] p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl relative overflow-hidden shrink-0 shadow-lg font-mono text-[10px] text-zinc-400 space-y-3">
            <div className="flex justify-between border-b border-zinc-850 pb-2">
              <span className="text-rose-400 font-bold">⚠️ SIMULATION_PREVIEW: STAGE_03</span>
              <span>T+12h</span>
            </div>
            
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between">
                <span>INCIDENT_TYPE:</span>
                <span className="text-white font-bold">MONSOON_FLOOD</span>
              </div>
              <div className="flex justify-between">
                <span>WATER_LEVEL_HEIGHT:</span>
                <span className="text-cyan-400 font-bold">1.5 METERS</span>
              </div>
              <div className="flex justify-between">
                <span>POPULATION_AT_RISK:</span>
                <span className="text-orange-400 font-bold">850,000 CITIZENS</span>
              </div>
            </div>

            <div className="w-full bg-zinc-950 h-2.5 border border-zinc-850 rounded overflow-hidden">
              <div className="h-full bg-teal-500" style={{ width: "60%" }}></div>
            </div>
            
            <div className="text-[9px] text-zinc-550 leading-normal border-t border-zinc-900 pt-2 font-sans">
              *Simulation projects local rail network suspension and BKC power grid outages.
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: HOW RESILIO AI WORKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10 text-center">
        <div className="mb-16">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest font-mono">// RESPONSE PIPELINE</span>
          <h2 className="text-3xl font-black text-white tracking-tighter mt-1">Predict → Simulate → Alert → Evacuate → Protect</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          
          <div className="p-5 bg-zinc-905/30 border border-zinc-900 rounded-xl text-left space-y-3 hover:border-zinc-800 transition-colors">
            <span className="text-xs font-black text-teal-400 font-mono">01 // DETECT</span>
            <h4 className="font-bold text-sm text-white">Detect Risk</h4>
            <p className="text-zinc-400 text-xs leading-normal font-sans">
              Identify coordinates and evaluate regional vulnerability parameters using cognitive threat scores.
            </p>
          </div>

          <div className="p-5 bg-zinc-905/30 border border-zinc-900 rounded-xl text-left space-y-3 hover:border-zinc-800 transition-colors">
            <span className="text-xs font-black text-teal-400 font-mono">02 // SIMULATE</span>
            <h4 className="font-bold text-sm text-white">Simulate Impact</h4>
            <p className="text-zinc-400 text-xs leading-normal font-sans">
              Advance time scrubbers to model flood circles or fire boundaries and check infrastructure outages.
            </p>
          </div>

          <div className="p-5 bg-zinc-905/30 border border-zinc-900 rounded-xl text-left space-y-3 hover:border-zinc-800 transition-colors">
            <span className="text-xs font-black text-teal-400 font-mono">03 // ALERT</span>
            <h4 className="font-bold text-sm text-white">Alert Citizens</h4>
            <p className="text-zinc-400 text-xs leading-normal font-sans">
              Broadcast critical alert notifications, color-coded markers, and detailed parameters straight to EOC feeds.
            </p>
          </div>

          <div className="p-5 bg-zinc-905/30 border border-zinc-900 rounded-xl text-left space-y-3 hover:border-zinc-800 transition-colors">
            <span className="text-xs font-black text-teal-400 font-mono">04 // EVACUATE</span>
            <h4 className="font-bold text-sm text-white">Guide Response</h4>
            <p className="text-zinc-400 text-xs leading-normal font-sans">
              Calculate safe evacuation corridors with Safety Scores (95%, 72%) and recommend nearest shelters.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: HACKATHON DEMO SCENARIO */}
      <section className="bg-rose-950/10 border-t border-b border-rose-900/30 py-16 px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-400 border border-rose-500/30 px-3 py-1 rounded bg-rose-950/40 font-mono tracking-widest uppercase animate-pulse">
            <Terminal className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>JUDGING_AUTOPILOT_MODULE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
            Mumbai Monsoon Flood Incident Demo
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
            Ready to review? Click below to launch the **Judge Demo Autopilot**. This self-navigating, 60-90 second walkthrough runs the Mumbai Monsoon Flood scenario, generates risks, sweeps the simulator map, broadcasts warning logs, plots Sion highway routes, and locks on a tactical command summary automatically.
          </p>

          <div className="pt-2">
            <button
              onClick={launchJudgeAutopilot}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-xs tracking-widest rounded transition-all shadow-lg shadow-rose-950/40 border border-rose-500 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <span>Execute Mumbai Autopilot Demo (90-Secs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center relative z-10 space-y-6">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Enter disaster command console</h2>
        <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed">
          Open the main dashboard to evaluate other Indian presets, trigger manual SOS alarms, and plot alternate route corridors.
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            <span>LAUNCH_COMMAND_CONSOLE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 px-6 bg-black/40 text-center relative z-10">
        <p className="text-[10px] text-zinc-650 font-mono uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Resilio AI Command Node. Built for Hackathon Demo Presentations. All Channels Encrypted.
        </p>
      </footer>

    </div>
  );
}
