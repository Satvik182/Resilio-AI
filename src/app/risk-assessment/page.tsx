"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Map from "@/components/map";
import { RiskAssessmentResult } from "@/lib/ai";
import {
  ShieldAlert,
  MapPin,
  Flame,
  Droplets,
  Activity,
  AlertTriangle,
  TrendingUp,
  RotateCcw,
  CheckCircle,
  Truck,
  Compass,
  ArrowRight,
  Terminal,
  Play,
  Pause,
  Clock,
  Info,
  Users
} from "lucide-react";

const CITIES = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 }
];

const DISASTER_TYPES = [
  { name: "Flood", icon: Droplets, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  { name: "Fire", icon: Flame, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { name: "Landslide", icon: Compass, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { name: "Disease Outbreak", icon: Activity, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

interface SimulationStep {
  hour: number;
  radiusMeters: number;
  event: string;
  status: "nominal" | "warning" | "critical" | "recovery";
  populationAffected: string;
  infrastructure: { name: string; status: "OPERATIONAL" | "COMPROMISED" | "OFFLINE"; type: string }[];
  resources: { item: string; quantity: string }[];
  evacuation: string;
}

const getCityCoordinates = (cityName: string): [number, number] => {
  const name = cityName.toLowerCase();
  if (name.includes("mumbai")) return [19.0760, 72.8777];
  if (name.includes("delhi")) return [28.6139, 77.2090];
  if (name.includes("chennai")) return [13.0827, 80.2707];
  if (name.includes("kolkata")) return [22.5726, 88.3639];
  if (name.includes("bengaluru")) return [12.9716, 77.5946];
  if (name.includes("hyderabad")) return [17.3850, 78.4867];
  return [19.0760, 72.8777]; // default
};

function getSimulationSteps(city: string, disasterType: string): SimulationStep[] {
  const isMumbaiFlood = city.toLowerCase().includes("mumbai") && disasterType.toLowerCase() === "flood";

  if (isMumbaiFlood) {
    return [
      {
        hour: 0,
        radiusMeters: 800,
        event: "Heavy monsoonal downpour coincides with a 4.8-meter high tide warning. Mithi River water levels rising rapidly. Storm drains starting to choke.",
        status: "nominal",
        populationAffected: "45,000 citizens",
        infrastructure: [
          { name: "Sion Local Rail Line", status: "OPERATIONAL", type: "Transit" },
          { name: "BKC Power Substation Grid B", status: "OPERATIONAL", type: "Utility" },
          { name: "Chhatrapati Shivaji Intl Airport Runway", status: "OPERATIONAL", type: "Transit" }
        ],
        resources: [
          { item: "Emergency Personnel", quantity: "350 responders" },
          { item: "Sandbags", quantity: "8,000 bags" }
        ],
        evacuation: "Pre-evacuation alerts broadcast to Dharavi Sector-3 and Kurla West low-lying zones."
      },
      {
        hour: 6,
        radiusMeters: 1800,
        event: "High tide peaks. Mithi River breaches embankments at Sion-Kurla corridor. Flash flooding reaches 0.8 meters on roads.",
        status: "warning",
        populationAffected: "280,000 citizens",
        infrastructure: [
          { name: "Sion Local Rail Line", status: "COMPROMISED", type: "Transit" },
          { name: "BKC Power Substation Grid B", status: "OPERATIONAL", type: "Utility" },
          { name: "Chhatrapati Shivaji Intl Airport Runway", status: "OPERATIONAL", type: "Transit" }
        ],
        resources: [
          { item: "Industrial Water Pumps", quantity: "12 units" },
          { item: "High-Water Rescue Trucks", quantity: "18 units" }
        ],
        evacuation: "Mandatory evacuation ordered for Kurla West. Divert traffic away from LBS Marg."
      },
      {
        hour: 12,
        radiusMeters: 3000,
        event: "Substation flooded. Electrical grid cut in BKC/Kalina. Local train tracks fully submerged. Western Express Highway faces gridlock.",
        status: "critical",
        populationAffected: "850,000 citizens",
        infrastructure: [
          { name: "Sion Local Rail Line", status: "OFFLINE", type: "Transit" },
          { name: "BKC Power Substation Grid B", status: "OFFLINE", type: "Utility" },
          { name: "Chhatrapati Shivaji Intl Airport Runway", status: "COMPROMISED", type: "Transit" }
        ],
        resources: [
          { item: "Mobile Generators", quantity: "20 units" },
          { item: "Emergency Inflatable Boats", quantity: "12 vessels" },
          { item: "Dry Rations & Drinkable Water", quantity: "25,000 packets" }
        ],
        evacuation: "All causeways to Sion closed. Coordinate search & rescue launches from BKC MMRDA Grounds."
      },
      {
        hour: 24,
        radiusMeters: 2600,
        event: "Monsoon rains subside. Tidal waters receding. Main focus shifts to clearing railway tracks and restoring utility transformers.",
        status: "critical",
        populationAffected: "1,200,000 citizens",
        infrastructure: [
          { name: "Sion Local Rail Line", status: "OFFLINE", type: "Transit" },
          { name: "BKC Power Substation Grid B", status: "COMPROMISED", type: "Utility" },
          { name: "Chhatrapati Shivaji Intl Airport Runway", status: "OPERATIONAL", type: "Transit" }
        ],
        resources: [
          { item: "Medical Kits", quantity: "4,000 units" },
          { item: "Silt Cleaning Bulldozers", quantity: "8 teams" }
        ],
        evacuation: "Primary expressways restricted to emergency logistics. Citizens advised to remain in high-rise structures."
      },
      {
        hour: 48,
        radiusMeters: 900,
        event: "Flood waters fully drained. Rail tracks certified safe. Grid restored. Shelters operating at 80% load.",
        status: "recovery",
        populationAffected: "150,000 in shelters",
        infrastructure: [
          { name: "Sion Local Rail Line", status: "OPERATIONAL", type: "Transit" },
          { name: "BKC Power Substation Grid B", status: "OPERATIONAL", type: "Utility" },
          { name: "Chhatrapati Shivaji Intl Airport Runway", status: "OPERATIONAL", type: "Transit" }
        ],
        resources: [
          { item: "Disinfectant Cleaners", quantity: "100 crates" },
          { item: "Health Screening Kits", quantity: "5,000 units" }
        ],
        evacuation: "Repatriation of evacuees to Kurla West approved. Structural safety checks complete."
      }
    ];
  }

  // Fallback generic but localized Indian simulator steps for other choices
  return [
    {
      hour: 0,
      radiusMeters: 400,
      event: `Initial warning signals logged for ${disasterType} scenario in ${city}. Meteorological and telemetry sensors monitoring closely.`,
      status: "nominal",
      populationAffected: "1,200 citizens",
      infrastructure: [
        { name: "Regional Transit Corridor", status: "OPERATIONAL", type: "Transit" },
        { name: "Power Grid Substation", status: "OPERATIONAL", type: "Utility" }
      ],
      resources: [
        { item: "First Responders", quantity: "45 personnel" }
      ],
      evacuation: "Advisory warnings dispatched to immediate low-lying/fringe locations."
    },
    {
      hour: 6,
      radiusMeters: 1000,
      event: `Telemetry logs signal a rapid spread of the ${disasterType} perimeter in ${city}. Local emergency control centers activated.`,
      status: "warning",
      populationAffected: "18,000 citizens",
      infrastructure: [
        { name: "Regional Transit Corridor", status: "COMPROMISED", type: "Transit" },
        { name: "Power Grid Substation", status: "OPERATIONAL", type: "Utility" }
      ],
      resources: [
        { item: "Response Vehicles", quantity: "8 units" }
      ],
      evacuation: "Partial evacuations initiated for high exposure corridors."
    },
    {
      hour: 12,
      radiusMeters: 2000,
      event: `Peak threat load reached. Emergency containment barriers established in ${city}. Utilities temporarily offline to prevent safety hazards.`,
      status: "critical",
      populationAffected: "75,000 citizens",
      infrastructure: [
        { name: "Regional Transit Corridor", status: "OFFLINE", type: "Transit" },
        { name: "Power Grid Substation", status: "OFFLINE", type: "Utility" }
      ],
      resources: [
        { item: "Emergency Supplies", quantity: "2,500 packets" }
      ],
      evacuation: "Mandatory dispatch directions to secondary relief camps. Emergency corridor active."
    },
    {
      hour: 24,
      radiusMeters: 1500,
      event: `Perimeters stabilizing. Incident teams reporting containment bounds are secure. Utility lines entering restoration audit.`,
      status: "critical",
      populationAffected: "120,000 citizens",
      infrastructure: [
        { name: "Regional Transit Corridor", status: "OFFLINE", type: "Transit" },
        { name: "Power Grid Substation", status: "COMPROMISED", type: "Utility" }
      ],
      resources: [
        { item: "Repair Crews", quantity: "15 teams" }
      ],
      evacuation: "Citizen movement restricted to official logistics convoys."
    },
    {
      hour: 48,
      radiusMeters: 500,
      event: `Operations cleared by hazard engineers. Structural safety checks completed. ${city} sector return to nominal status.`,
      status: "recovery",
      populationAffected: "15,000 in shelters",
      infrastructure: [
        { name: "Regional Transit Corridor", status: "OPERATIONAL", type: "Transit" },
        { name: "Power Grid Substation", status: "OPERATIONAL", type: "Utility" }
      ],
      resources: [
        { item: "Sanitizer Kits", quantity: "1,500 units" }
      ],
      evacuation: "Repatriation of citizens cleared by EOC officers."
    }
  ];
}

export default function RiskAssessmentPage() {
  const [location, setLocation] = useState("Mumbai, MH");
  const [disasterType, setDisasterType] = useState("Flood");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [assessment, setAssessment] = useState<RiskAssessmentResult | null>(null);
  const [error, setError] = useState("");
  const [demoActive, setDemoActive] = useState(false);

  // Integrated simulation states
  const [showSimulation, setShowSimulation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [playbackSpeed] = useState(2500); // 2.5s per step

  useEffect(() => {
    const isDemo = localStorage.getItem("resilio_demo_mode") === "mumbai";
    setDemoActive(isDemo);
    if (isDemo) {
      setLocation("Mumbai, MH");
      setDisasterType("Flood");
    }
  }, []);

  // Auto-trigger Stage 2 AI Risk Assessment
  useEffect(() => {
    const stage = localStorage.getItem("resilio_judge_mode_stage");
    if (stage === "2" && !assessment && !loading) {
      const timer = setTimeout(() => {
        setLocation("Mumbai, MH");
        setDisasterType("Flood");
        handleRunAssessment();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [assessment, loading]);

  // Auto-play Integrated Scrubber during Stage 3
  useEffect(() => {
    const stage = localStorage.getItem("resilio_judge_mode_stage");
    if (stage === "3" && assessment) {
      setShowSimulation(true);
      const interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < 4) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [assessment]);

  // Manual isPlaying playback logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && assessment) {
      const steps = getSimulationSteps(assessment.location, assessment.disasterType);
      timer = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, assessment]);

  const handleRunAssessment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!location.trim()) {
      setError("Please select a target city.");
      return;
    }

    setLoading(true);
    setError("");
    setAssessment(null);
    setShowSimulation(false);
    setCurrentStepIdx(0);
    setIsPlaying(false);

    const statuses = [
      "Contacting cognitive assessment networks...",
      "Analyzing topography database grids...",
      "Overlaying localized precipitation & historic feeds...",
      "Calculating vulnerability impact indexes...",
      "Formatting response payloads..."
    ];

    let statusIdx = 0;
    setLoadingStatus(statuses[0]);
    const statusInterval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setLoadingStatus(statuses[statusIdx]);
    }, 1200);

    try {
      const res = await fetch("/api/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, disasterType }),
      });

      if (res.ok) {
        const data = await res.json();
        setAssessment(data);
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to contact risk evaluation node.");
      }
    } catch (err) {
      setError("Network error: Could not reach operations server.");
    } finally {
      clearInterval(statusInterval);
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-rose-500 border-rose-500/35 bg-rose-500/5";
    if (score >= 70) return "text-orange-500 border-orange-500/35 bg-orange-500/5";
    if (score >= 45) return "text-amber-500 border-amber-500/35 bg-amber-500/5";
    return "text-emerald-500 border-emerald-500/35 bg-emerald-500/5";
  };

  const simSteps = assessment ? getSimulationSteps(assessment.location, assessment.disasterType) : [];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full font-mono">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">// AI HAZARD RISK EVALUATION & SIMULATION PROTOCOL</h2>
          </div>
          {assessment && (
            <button
              onClick={() => {
                setAssessment(null);
                setShowSimulation(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TRIGGER_NEW_SCAN</span>
            </button>
          )}
        </div>

        {!assessment ? (
          /* Input Request Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <form 
              onSubmit={handleRunAssessment}
              className="lg:col-span-2 bg-zinc-950/60 border border-zinc-900 p-6 rounded-xl flex flex-col gap-6 relative"
            >
              <div className="flex items-center gap-2 text-teal-400 pb-2 border-b border-zinc-900">
                <ShieldAlert className="w-5 h-5 text-teal-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Configure Target Telemetry</h3>
              </div>

              {/* Step 1: Select City */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Step 1: Select Target City</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CITIES.map((c) => {
                    const isSelected = location.toLowerCase().includes(c.name.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => setLocation(c.name + ", IN")}
                        className={`py-2.5 px-3 rounded border text-[10px] font-bold transition-all uppercase cursor-pointer ${
                          isSelected
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/40 shadow-sm"
                            : "bg-zinc-950/40 text-zinc-650 border-zinc-850 hover:border-zinc-750 hover:text-zinc-400"
                        }`}
                        disabled={loading || demoActive}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Disaster Vector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Step 2: Select Disaster Vector
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DISASTER_TYPES.map((type) => {
                    const isSelected = disasterType.toLowerCase() === type.name.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={type.name}
                        onClick={() => setDisasterType(type.name)}
                        className={`p-3 rounded border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/40 shadow-sm"
                            : "bg-zinc-950/40 text-zinc-650 border-zinc-850 hover:border-zinc-750 hover:text-zinc-400"
                        }`}
                        disabled={loading || demoActive}
                      >
                        <type.icon className="w-5 h-5" />
                        <span className="text-[10px] font-semibold">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-zinc-950 border-zinc-400 rounded-full animate-spin"></div>
                    <span>{loadingStatus}</span>
                  </>
                ) : (
                  <>
                    <span>Execute Predictive Risk Assessment</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Info panel */}
            <div className="bg-zinc-900/10 border border-zinc-900 p-6 rounded-xl flex flex-col gap-4 text-[10px] text-zinc-400 leading-relaxed font-mono">
              <h4 className="font-bold text-zinc-300">// CORE PREDICTIVE PARAMETERS</h4>
              <p>
                Platform integrates regional satellite meteorological maps, soil saturation gauges, and population density metrics to overlay structural vulnerability ratios.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  <p><strong>Predict:</strong> Fast-scan scoring of structural damage thresholds.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  <p><strong>Analyze:</strong> Pinpoints blockages, floodways, and mud zones.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results View Dashboard + Integrated Simulator */
          <div className="flex flex-col gap-6">
            
            {/* Top row: Results cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              
              {/* Left Column: Risk Score & Vulnerable Zones */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Score card */}
                <div className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center backdrop-blur-sm ${getScoreColor(assessment.riskScore)}`}>
                  <span className="text-[9px] uppercase font-mono font-bold tracking-wider opacity-60">Composite Hazard Rating</span>
                  <div className="relative flex items-center justify-center w-28 h-28 my-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" className="stroke-zinc-900" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="stroke-current"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="301.6"
                        strokeDashoffset={301.6 - (301.6 * assessment.riskScore) / 100}
                      />
                    </svg>
                    <span className="absolute text-2xl font-black font-mono tracking-tight">{assessment.riskScore}</span>
                  </div>
                  <h4 className="font-bold text-xs tracking-wide uppercase">
                    {assessment.riskScore >= 80 ? "Critical Threat Level" :
                     assessment.riskScore >= 60 ? "High Threat Level" :
                     assessment.riskScore >= 40 ? "Moderate Threat" : "Low Threat Level"}
                  </h4>
                  <span className="text-[9px] opacity-60 font-mono mt-1 uppercase">LOC_SECTOR: {assessment.location}</span>
                </div>

                {/* Telemetry Status card */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-3 font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Telemetry Statistics</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold animate-pulse ${
                      assessment.riskScore >= 85 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                      assessment.riskScore >= 60 ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}>
                      {assessment.riskScore >= 85 ? "CRITICAL" : assessment.riskScore >= 60 ? "HIGH_WARNING" : "NOMINAL"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded">
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold">Population At Risk</span>
                      <span className="text-sm font-black text-rose-500 mt-1 block">
                        {assessment.riskScore >= 90 ? "45,000" : Math.round(assessment.riskScore * 350 + 200).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-zinc-950 border border-zinc-900 rounded">
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold">Infra Impact</span>
                      <span className="text-[10px] font-black text-amber-500 mt-1.5 block uppercase">
                        {assessment.riskScore >= 85 ? "Severe" : assessment.riskScore >= 60 ? "Moderate" : "Minimal"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vulnerable Zones card */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-900">
                    Critical Impact Sectors
                  </h3>
                  <div className="space-y-3">
                    {assessment.vulnerableZones.map((zone, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950/80 border border-zinc-900 rounded flex flex-col gap-1 text-[10px]">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-zinc-200">{zone.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            zone.hazardLevel === "High" ? "bg-rose-500/20 text-rose-400" :
                            zone.hazardLevel === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                          }`}>
                            {zone.hazardLevel}
                          </span>
                        </div>
                        <p className="text-zinc-400 leading-normal font-sans text-[11px]">{zone.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Summary, Recommended Actions, Resources */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Summary card */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>AI Predictive Incident Assessment</span>
                  </h3>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    {assessment.impactSummary}
                  </p>
                  <div className="bg-zinc-950/80 p-3 rounded border border-zinc-850 text-[10px] text-zinc-400 flex items-center gap-2 mt-2 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0"></span>
                    <p><strong>EVACUATION_STATUS:</strong> {assessment.evacuationReadiness}</p>
                  </div>
                </div>

                {/* Recommended action list */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-900">
                    Recommended Actions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Prepare */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest font-mono">01_PREPARE</span>
                      <div className="space-y-2">
                        {assessment.recommendedActions.filter(a => a.phase === "Prepare").map((act, idx) => (
                          <div key={idx} className="flex gap-2 p-2.5 bg-zinc-950/80 rounded border border-zinc-900">
                            <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-zinc-350 leading-normal font-sans">{act.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* During */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest font-mono">02_RESPOND</span>
                      <div className="space-y-2">
                        {assessment.recommendedActions.filter(a => a.phase === "During").map((act, idx) => (
                          <div key={idx} className="flex gap-2 p-2.5 bg-zinc-950/80 rounded border border-zinc-900">
                            <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-zinc-350 leading-normal font-sans">{act.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recover */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">03_RECOVER</span>
                      <div className="space-y-2">
                        {assessment.recommendedActions.filter(a => a.phase === "Recover").map((act, idx) => (
                          <div key={idx} className="flex gap-2 p-2.5 bg-zinc-950/80 rounded border border-zinc-900">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-zinc-350 leading-normal font-sans">{act.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource requirement allocation */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-900 flex items-center gap-1.5">
                    <Truck className="w-4.5 h-4.5 text-zinc-500" />
                    <span>Logistics Resource Allocation</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {assessment.resourceRequirements.map((res, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950/80 border border-zinc-900 rounded flex items-center justify-between text-[10px]">
                        <div>
                          <h5 className="font-bold text-zinc-200">{res.item}</h5>
                          <span className="text-[9px] text-zinc-550 font-mono mt-0.5 block">QTY: {res.quantity}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          res.urgency === "Immediate" ? "bg-rose-500/20 text-rose-400" :
                          res.urgency === "Within 24h" ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {res.urgency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Run Simulation CTA */}
            {!showSimulation && (
              <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                <div className="text-left font-mono">
                  <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest">// MODEL_PREDICTIVE_IMPACT</span>
                  <h4 className="font-bold text-white text-xs mt-0.5">Disaster Progression & Infrastructure Outage Simulation</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed mt-1 font-sans">
                    Run the interactive 48-hour timeline simulator to model localized flood boundaries, evacuation safety ratings, and rescue resource distributions on the map.
                  </p>
                </div>
                <button
                  onClick={() => setShowSimulation(true)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 border border-rose-500 text-white font-black uppercase text-xs tracking-widest rounded transition-all cursor-pointer shrink-0 animate-pulse font-mono"
                >
                  Run Impact Simulation
                </button>
              </div>
            )}

            {/* Integrated Simulation Interface */}
            {showSimulation && simSteps.length > 0 && (
              <div className="flex flex-col gap-6 border-t border-zinc-900 pt-6 animate-fade-in">
                <div className="pb-2 border-b border-zinc-900">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                    // Integrated Crisis Impact Simulation Interface
                  </h3>
                </div>

                {/* Scrubber Playback Controls */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-mono"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause Timeline</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-zinc-950" />
                          <span>Run Simulator</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx(0);
                      }}
                      className="p-2.5 rounded border border-zinc-850 hover:border-zinc-750 text-zinc-500 hover:text-white transition-all bg-zinc-950/40 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2 border-l border-zinc-900 pl-3">
                      <Clock className="w-4 h-4 text-zinc-650" />
                      <span>TIMELINE ELAPSED: T+{simSteps[currentStepIdx].hour} HOURS</span>
                    </div>
                  </div>

                  {/* Scrubber slider */}
                  <div className="flex-1 max-w-xl flex items-center gap-3">
                    <span className="text-[9px] text-zinc-550 font-mono">0h</span>
                    <div className="flex-1 relative flex items-center select-none">
                      <input
                        type="range"
                        min="0"
                        max={simSteps.length - 1}
                        value={currentStepIdx}
                        onChange={(e) => {
                          setIsPlaying(false);
                          setCurrentStepIdx(parseInt(e.target.value));
                        }}
                        className="w-full accent-teal-500 bg-zinc-800 rounded appearance-none h-1 cursor-pointer"
                      />
                    </div>
                    <span className="text-[9px] text-zinc-550 font-mono">48h</span>
                  </div>
                </div>

                {/* Map + Telemetry logs grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
                  
                  {/* Map Console (Span 2) */}
                  <div className="lg:col-span-2 flex flex-col h-[400px] lg:h-auto">
                    <div className="flex justify-between items-center px-3 py-1.5 bg-black/80 border-t border-x border-zinc-800 rounded-t-xl text-[9px] font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        <span>HUD IMPACT TIMELINE // T+{simSteps[currentStepIdx].hour}h // RADIUS: {simSteps[currentStepIdx].radiusMeters}M</span>
                      </div>
                      <span className="text-zinc-550 font-bold">GRID_ZOOM: 13x</span>
                    </div>
                    <div className="flex-1 min-h-[400px] border-x border-b border-zinc-800 rounded-b-xl overflow-hidden">
                      <Map
                        center={getCityCoordinates(assessment.location)}
                        zoom={13}
                        simulationData={{
                          lat: getCityCoordinates(assessment.location)[0],
                          lng: getCityCoordinates(assessment.location)[1],
                          radius: simSteps[currentStepIdx].radiusMeters,
                          type: assessment.disasterType as "Flood" | "Fire" | "Landslide" | "Disease",
                          severity: simSteps[currentStepIdx].status
                        }}
                      />
                    </div>
                  </div>

                  {/* Details column (Span 1) */}
                  <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-[520px] pr-1">
                    
                    {/* Step Event Card */}
                    <div className={`p-4 rounded-xl border flex flex-col gap-3 backdrop-blur-sm ${
                      simSteps[currentStepIdx].status === "critical" ? "border-rose-500/40 bg-rose-950/10 text-rose-400" :
                      simSteps[currentStepIdx].status === "warning" ? "border-orange-500/40 bg-orange-950/10 text-orange-400" :
                      simSteps[currentStepIdx].status === "recovery" ? "border-emerald-500/40 bg-emerald-950/10 text-emerald-400" :
                      "border-zinc-800 bg-zinc-950/40 text-zinc-500"
                    }`}>
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60 font-mono">
                        <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Incident Log</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-zinc-900 border border-zinc-800">
                          {simSteps[currentStepIdx].status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-200 leading-relaxed font-sans">
                        {simSteps[currentStepIdx].event}
                      </p>
                      <div className="bg-zinc-950/80 p-2.5 rounded border border-zinc-850 flex items-start gap-2 text-[9px] font-mono">
                        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-zinc-350">// DIRECTIVE</span>
                          <p className="text-zinc-400 mt-0.5">{simSteps[currentStepIdx].evacuation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex flex-col gap-3 font-mono">
                      <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest">// Simulated Impact Telemetry</span>
                      <div className="p-2.5 bg-zinc-900/40 border border-zinc-850 rounded flex justify-between items-center">
                        <span className="text-[9px] text-zinc-400 uppercase font-semibold">Population Affected:</span>
                        <span className="text-[10px] font-black text-orange-400 animate-pulse bg-orange-950/30 border border-orange-900/40 px-2.5 py-0.5 rounded">
                          {simSteps[currentStepIdx].populationAffected}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-1">
                        <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Infrastructure Status:</span>
                        {simSteps[currentStepIdx].infrastructure.map((infra, idx) => (
                          <div key={idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded flex justify-between items-center text-[9px]">
                            <div>
                              <span className="text-zinc-200 font-bold block">{infra.name}</span>
                              <span className="text-[7px] text-zinc-500 uppercase font-semibold">{infra.type}</span>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-black border uppercase tracking-wider ${
                              infra.status === "OFFLINE" ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse" :
                              infra.status === "COMPROMISED" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                              "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }`}>
                              {infra.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl flex flex-col gap-3 font-mono">
                      <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest">// Logistics Inventory Demand</span>
                      <div className="space-y-1.5">
                        {simSteps[currentStepIdx].resources.map((res, idx) => (
                          <div key={idx} className="p-2 bg-zinc-900/40 border border-zinc-850 rounded flex justify-between items-center text-[9px]">
                            <span className="text-zinc-300 font-bold">{res.item}</span>
                            <span className="font-black text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded">
                              {res.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
