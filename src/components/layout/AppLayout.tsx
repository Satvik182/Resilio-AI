"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Play,
  AlertTriangle,
  MapPin,
  Route,
  Flame,
  Clock,
  Radio,
  Terminal,
  Activity,
  Zap,
  Lock,
  Globe,
  Database,
  Award,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeType?: "danger" | "warning";
}

const NAV_ITEMS: NavItem[] = [
  { name: "Emergency Operations Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Risk Assessment & Simulation", href: "/risk-assessment", icon: ShieldAlert },
  { name: "Live Alerts", href: "/alerts", icon: AlertTriangle, badge: "Feed", badgeType: "danger" },
  { name: "Evacuation Planner", href: "/routes", icon: Route },
  { name: "Relief Camp Locator", href: "/camps", icon: MapPin },
  { name: "Emergency SOS", href: "/sos", icon: Flame, badge: "SOS", badgeType: "danger" }
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveTime, setLiveTime] = useState("");
  const [demoActive, setDemoActive] = useState(false);
  const [judgeStage, setJudgeStage] = useState<number>(0);

  // Check demo mode state & judge autopilot on mount
  useEffect(() => {
    setDemoActive(localStorage.getItem("resilio_demo_mode") === "mumbai");
    const stage = parseInt(localStorage.getItem("resilio_judge_mode_stage") || "0");
    setJudgeStage(stage);

    // Live clock
    const updateTime = () => {
      const date = new Date();
      setLiveTime(
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Central Autopilot state machine
  useEffect(() => {
    if (judgeStage === 0) return;

    const path = window.location.pathname;
    let timer: NodeJS.Timeout;

    if (judgeStage === 1) {
      if (path !== "/dashboard") {
        window.location.href = "/dashboard";
        return;
      }
      timer = setTimeout(() => {
        localStorage.setItem("resilio_judge_mode_stage", "2");
        window.location.href = "/risk-assessment";
      }, 7000); // 7s on Dashboard alert
    } else if (judgeStage === 2) {
      if (path !== "/risk-assessment") {
        window.location.href = "/risk-assessment";
        return;
      }
      timer = setTimeout(() => {
        localStorage.setItem("resilio_judge_mode_stage", "3");
        setJudgeStage(3); // Transition local state to run the simulation scrubber inline
      }, 5000); // 5s on Risk Assessment load
    } else if (judgeStage === 3) {
      if (path !== "/risk-assessment") {
        window.location.href = "/risk-assessment";
        return;
      }
      timer = setTimeout(() => {
        localStorage.setItem("resilio_judge_mode_stage", "4");
        window.location.href = "/routes";
      }, 15000); // 15s for the integrated simulation timeline scrubber
    } else if (judgeStage === 4) {
      if (path !== "/routes") {
        window.location.href = "/routes";
        return;
      }
      timer = setTimeout(() => {
        localStorage.setItem("resilio_judge_mode_stage", "5");
        window.location.href = "/camps";
      }, 8000); // 8s on Routes
    } else if (judgeStage === 5) {
      if (path !== "/camps") {
        window.location.href = "/camps";
        return;
      }
      timer = setTimeout(() => {
        localStorage.setItem("resilio_judge_mode_stage", "6");
        window.location.href = "/dashboard";
      }, 8000); // 8s on Camps
    }

    return () => clearTimeout(timer);
  }, [judgeStage]);

  const toggleDemoMode = () => {
    const next = !demoActive;
    setDemoActive(next);
    if (next) {
      localStorage.setItem("resilio_demo_mode", "mumbai");
      window.location.href = "/dashboard";
    } else {
      localStorage.removeItem("resilio_demo_mode");
      localStorage.removeItem("resilio_judge_mode_stage");
      window.location.href = "/dashboard";
    }
  };

  const startJudgeAutopilot = () => {
    localStorage.setItem("resilio_demo_mode", "mumbai");
    localStorage.setItem("resilio_judge_mode_stage", "1");
    window.location.href = "/dashboard";
  };

  const exitJudgeAutopilot = () => {
    localStorage.removeItem("resilio_judge_mode_stage");
    localStorage.removeItem("resilio_demo_mode");
    window.location.href = "/dashboard";
  };

  // Autopilot Step descriptions
  const getAutopilotStepText = () => {
    if (judgeStage === 1) return "STEP 1/6: IMD Heavy Rainfall Alert Received (Mumbai Sector)";
    if (judgeStage === 2) return "STEP 2/6: AI Risk Engine Generating Vulnerability Ratings...";
    if (judgeStage === 3) return "STEP 3/6: Disaster Simulator Running Flood Spread & Utility Outage Timelines...";
    if (judgeStage === 4) return "STEP 4/6: Evacuation Routing Generated (Route A: 95% Safety Score)";
    if (judgeStage === 5) return "STEP 5/6: Directing Arrivals to Safest Shelter (BKC MMRDA Grounds)";
    if (judgeStage === 6) return "STEP 6/6: Crisis Summary Report Generated // Platform Locked";
    return "";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-mono select-none hud-grid hud-scanline">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-black/90 border-r border-zinc-800 relative z-10 shrink-0">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-zinc-800">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-teal-500 shadow shadow-teal-500/20">
            <Radio className="w-5 h-5 text-zinc-950 animate-pulse" />
          </div>
          <div>
            <h1 className="font-black text-xs text-white leading-tight tracking-tighter">RESILIO // EOC</h1>
            <p className="text-[9px] text-teal-400 font-bold tracking-widest uppercase">COMMAND NODE</p>
          </div>
        </div>

        {/* Telemetry metadata */}
        <div className="px-5 py-3 border-b border-zinc-900 bg-zinc-950/40 space-y-1.5 text-[9px] text-zinc-500">
          <div className="flex justify-between items-center">
            <span>NODE_CHANNEL:</span>
            <span className="text-teal-400 font-bold flex items-center gap-1">SECURE</span>
          </div>
          <div className="flex justify-between items-center">
            <span>GRID_RESOLUTION:</span>
            <span className="text-zinc-300 font-bold">100M_LOC</span>
          </div>
          <div className="flex justify-between items-center">
            <span>ENCRYPTION:</span>
            <span className="text-teal-500 font-bold">AES_256</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded border text-[10px] transition-all duration-150 ${
                  isActive
                    ? "bg-teal-950/40 text-teal-400 border-teal-500/30 shadow-inner font-bold"
                    : "text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-zinc-250"
                }`}
                style={{ pointerEvents: judgeStage > 0 ? "none" : "auto" }} // disable clicks during autoplay
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-zinc-500"}`} />
                  <span className="tracking-tight">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1 rounded-[2px] text-[8px] font-black uppercase ${
                    item.badgeType === "danger"
                      ? "bg-rose-950/40 text-rose-400 border border-rose-500/20 animate-pulse"
                      : "bg-teal-950/40 text-teal-400 border border-teal-500/20"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 9. Data Sources Panel */}
        <div className="px-5 py-3.5 border-t border-zinc-900 bg-zinc-950/30 text-[9px] text-zinc-550 space-y-1.5 font-mono">
          <span className="font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Database className="w-3 h-3 text-teal-500" />
            <span>DATA_SOURCES:</span>
          </span>
          <div className="space-y-1 text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ChevronRight className="w-2.5 h-2.5 text-teal-500" />
              <span>IMD Weather Datasets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight className="w-2.5 h-2.5 text-teal-500" />
              <span>NDMA Guidelines (V2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight className="w-2.5 h-2.5 text-teal-500" />
              <span>OpenStreetMap layers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight className="w-2.5 h-2.5 text-teal-500" />
              <span>Public Crisis archives</span>
            </div>
          </div>
        </div>

        {/* System Logs Indicator */}
        <div className="p-4 border-t border-zinc-800 bg-black/60 space-y-2">
          <div className="flex items-center justify-between text-[9px] text-zinc-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span className="font-bold">{liveTime || "00:00:00"}</span>
            </div>
            <span className="text-[8px] bg-emerald-950/30 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-900/50">
              SYS_OK
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-black/40">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 md:px-6 h-16 border-b border-zinc-900 bg-black/80 backdrop-blur-md relative z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="hidden sm:block text-xs font-black tracking-wider text-zinc-400 uppercase">
              // Disaster Response Command Center
            </h2>
          </div>

          <div className="flex items-center gap-3">
            
            <Link 
              href="/"
              className="text-[9px] border border-zinc-850 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 rounded transition-colors tracking-widest hover:text-white"
            >
              EXIT_CONSOLE
            </Link>

            {/* 10. Judge Autopilot Trigger */}
            <button
              onClick={judgeStage > 0 ? exitJudgeAutopilot : startJudgeAutopilot}
              className={`flex items-center gap-2 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                judgeStage > 0
                  ? "bg-rose-600 text-white border border-rose-400 animate-alert-blink shadow shadow-rose-600/30"
                  : "bg-teal-500 text-zinc-950 border border-teal-400 hover:bg-teal-400"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>{judgeStage > 0 ? "EXIT_JUDGE_MODE" : "Judge Demo Mode"}</span>
            </button>

            {/* Manual Demo Toggle */}
            {judgeStage === 0 && (
              <button
                onClick={toggleDemoMode}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  demoActive
                    ? "bg-amber-600/20 text-amber-400 border border-amber-500/50"
                    : "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-850"
                }`}
              >
                <span>{demoActive ? "DEMO_MODE_ACTIVE" : "ACTIVATE_DEMO"}</span>
              </button>
            )}

          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 relative">
          
          {/* Autopilot HUD Flashing Banner */}
          {judgeStage > 0 && (
            <div className="mb-6 p-3 bg-rose-950/20 border border-rose-900/40 rounded flex items-center justify-between gap-3 text-rose-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 animate-ping" />
                <span>{getAutopilotStepText()}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AUTOPILOT_DRIVE</span>
              </div>
            </div>
          )}

          {/* Manual Demo Mode banner */}
          {demoActive && judgeStage === 0 && (
            <div className="mb-6 p-3 bg-amber-950/20 border border-amber-900/40 rounded flex items-center justify-between gap-3 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>DEMO ENVIRONMENT ACTIVE // locked to Mumbai flash flood warning.</span>
              </div>
              <button 
                onClick={toggleDemoMode}
                className="text-[8px] bg-amber-500 text-black px-2 py-0.5 rounded font-black hover:bg-amber-400"
              >
                RESET_SYSTEM
              </button>
            </div>
          )}

          {children}
        </main>
      </div>

    </div>
  );
}
