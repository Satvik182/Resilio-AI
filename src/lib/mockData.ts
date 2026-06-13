export interface LocationPreset {
  name: string;
  lat: number;
  lng: number;
  description: string;
  riskFactors: string[];
}

export const LOCATION_PRESETS: LocationPreset[] = [
  {
    name: "Mumbai, MH",
    lat: 19.0760,
    lng: 72.8777,
    description: "Coastal metropolis subject to extreme monsoonal precipitation, urban flooding, and Mithi River overflow.",
    riskFactors: ["Monsoon Flooding", "High Tide Storm Surge", "Sion-Kurla Grid Outages"],
  },
  {
    name: "Delhi, DL",
    lat: 28.6139,
    lng: 77.2090,
    description: "Capital region vulnerable to seismic activity (Zone IV), Yamuna River bed rise, and intense summer heat waves.",
    riskFactors: ["Seismic Tremors", "Yamuna River Overflows", "Particulate Smog Crises"],
  },
  {
    name: "Chennai, TN",
    lat: 13.0827,
    lng: 80.2707,
    description: "Coastal capital vulnerable to North-East monsoon cyclonic storms, extreme precipitation, and drainage bottlenecks.",
    riskFactors: ["Cyclones", "Urban Inundations", "Adyar River Overflow"],
  },
  {
    name: "Kolkata, WB",
    lat: 22.5726,
    lng: 88.3639,
    description: "Sundarbans delta fringe vulnerable to tidal surges, cyclonic wind damage, and Hooghly River overflowing.",
    riskFactors: ["Sundarbans Storm Surges", "Gale Winds", "Delta Inundation"],
  },
  {
    name: "Bengaluru, KA",
    lat: 12.9716,
    lng: 77.5946,
    description: "Upland tech hub subject to heavy local downpours, lake bed breaches, and rapid drainage channel choking.",
    riskFactors: ["Lake Breach Flooding", "Rapid Drainage Choking", "Run-off Waterlogging"],
  },
  {
    name: "Hyderabad, TG",
    lat: 17.3850,
    lng: 78.4867,
    description: "Deccan capital prone to local cloudbursts, Musi River overflows, and low-lying residential flooding.",
    riskFactors: ["Musi River Overflows", "Urban Cloudbursts", "Drainage Blockages"],
  },
];

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "Flood" | "Fire" | "Landslide" | "Disease" | "Weather" | "Seismic";
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
  active: boolean;
}

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: "alert-1",
    title: "CRITICAL: Mumbai Flood Warning",
    description: "Extreme monsoon precipitation coincides with a 4.9m high tide. Mithi River has breached safety banks. Immediate evacuation ordered for Kurla and Dharavi.",
    severity: "critical",
    category: "Flood",
    locationName: "Mumbai (Kurla Corridor)",
    lat: 19.072,
    lng: 72.864,
    timestamp: new Date().toISOString(),
    active: true,
  },
  {
    id: "alert-2",
    title: "HIGH: Landslide Risk in Himachal Pradesh",
    description: "Active soil creep and rock slip warnings triggered on national highways in Shimla and Kinnaur. Geotechnical sensors report high saturation index.",
    severity: "high",
    category: "Landslide",
    locationName: "Himachal Pradesh (Highway cut-slopes)",
    lat: 31.1048,
    lng: 77.1734,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    active: true,
  },
  {
    id: "alert-3",
    title: "MEDIUM: Heavy Rainfall Alert in Chennai",
    description: "North-East monsoon depressions forming over Bay of Bengal. Expect continuous heavy rain over 48h. Minor street accumulation in Velachery and Nungambakkam.",
    severity: "medium",
    category: "Weather",
    locationName: "Chennai (Velachery Sector)",
    lat: 12.9815,
    lng: 80.2227,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    active: true,
  },
  {
    id: "alert-4",
    title: "LOW: River Water Level Monitoring",
    description: "Yamuna River discharge from Hathnikund barrage monitored. Levels are rising near old bridge but remain under warning threshold. Regular audits active.",
    severity: "low",
    category: "Flood",
    locationName: "New Delhi (Yamuna Bank)",
    lat: 28.643,
    lng: 77.262,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    active: false,
  },
];

export interface ReliefCamp {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  occupancy: number;
  status: "open" | "filling" | "full" | "closed";
  supplies: {
    water: "high" | "medium" | "low" | "critical";
    food: "high" | "medium" | "low" | "critical";
    medical: "high" | "medium" | "low" | "critical";
    power: "stable" | "generator" | "offline";
  };
  contact: string;
}

export const INITIAL_CAMPS: ReliefCamp[] = [
  {
    id: "camp-1",
    name: "BKC Exhibition Grounds Shelter",
    address: "MMRDA Grounds, Bandra Kurla Complex, Mumbai 400051",
    lat: 19.062,
    lng: 72.863,
    capacity: 6000,
    occupancy: 2800,
    status: "open",
    supplies: {
      water: "high",
      food: "high",
      medical: "high",
      power: "stable",
    },
    contact: "+91 22-5555-0199",
  },
  {
    id: "camp-2",
    name: "Wankhede Stadium Transit Hub",
    address: "D-Road, Churchgate, Mumbai 400020",
    lat: 18.938,
    lng: 72.825,
    capacity: 10000,
    occupancy: 8900,
    status: "filling",
    supplies: {
      water: "medium",
      food: "medium",
      medical: "low",
      power: "stable",
    },
    contact: "+91 22-5555-0120",
  },
  {
    id: "camp-3",
    name: "Dharavi Sports Complex Center",
    address: "60-Feet Road, Dharavi, Mumbai 400017",
    lat: 19.041,
    lng: 72.859,
    capacity: 2500,
    occupancy: 2500,
    status: "full",
    supplies: {
      water: "low",
      food: "low",
      medical: "medium",
      power: "generator",
    },
    contact: "+91 22-5555-0178",
  },
  {
    id: "camp-4",
    name: "Thane Town Hall Shelter",
    address: "Station Road, Thane West 400601",
    lat: 19.186,
    lng: 72.972,
    capacity: 3000,
    occupancy: 450,
    status: "open",
    supplies: {
      water: "high",
      food: "high",
      medical: "medium",
      power: "stable",
    },
    contact: "+91 22-5555-0144",
  },
];

export interface EvacuationRoute {
  id: string;
  name: string;
  start: [number, number];
  end: [number, number];
  polyline: [number, number][];
  distanceKm: number;
  durationMins: number;
  safetyRating: number; // percentage e.g. 95
  hazardReason?: string;
  type: "primary" | "secondary" | "alternate";
}

export const MOCK_ROUTES: Record<string, EvacuationRoute[]> = {
  "Mumbai, MH": [
    {
      id: "route-mum-1",
      name: "Route A // Sion-Panvel Highway (Elevated Corridor)",
      start: [19.0760, 72.8777],
      end: [19.0200, 73.0100],
      polyline: [
        [19.0760, 72.8777],
        [19.0600, 72.8900],
        [19.0450, 72.9200],
        [19.0380, 72.9600],
        [19.0200, 73.0100]
      ],
      distanceKm: 16.5,
      durationMins: 32,
      safetyRating: 95,
      type: "primary",
    },
    {
      id: "route-mum-2",
      name: "Route B // Eastern Express Highway (Alternate)",
      start: [19.0760, 72.8777],
      end: [19.1860, 72.9720],
      polyline: [
        [19.0760, 72.8777],
        [19.0900, 72.8950],
        [19.1200, 72.9150],
        [19.1500, 72.9400],
        [19.1860, 72.9720]
      ],
      distanceKm: 14.8,
      durationMins: 48,
      safetyRating: 72,
      hazardReason: "Minor water-clogging reports in Chembur bypass lanes. Maintain center-lane flow.",
      type: "alternate",
    },
    {
      id: "route-mum-3",
      name: "Route C // LBS Marg (High Water Risk)",
      start: [19.0760, 72.8777],
      end: [19.1300, 72.9200],
      polyline: [
        [19.0760, 72.8777],
        [19.0920, 72.8850],
        [19.1120, 72.9020],
        [19.1300, 72.9200]
      ],
      distanceKm: 8.2,
      durationMins: 85,
      safetyRating: 41,
      hazardReason: "Mithi River backflow has flooded this roadway. Maximum water depth: 1.8 meters. Avoid route.",
      type: "secondary",
    }
  ],
  "Delhi, DL": [
    {
      id: "route-del-1",
      name: "Route A // Ring Road Flyovers",
      start: [28.6139, 77.2090],
      end: [28.5800, 77.2500],
      polyline: [
        [28.6139, 77.2090],
        [28.6050, 77.2250],
        [28.5920, 77.2400],
        [28.5800, 77.2500]
      ],
      distanceKm: 5.8,
      durationMins: 12,
      safetyRating: 98,
      type: "primary",
    }
  ],
  "Chennai, TN": [
    {
      id: "route-che-1",
      name: "Route A // Mount Road / Anna Salai Corridor",
      start: [13.0827, 80.2707],
      end: [12.9800, 80.2200],
      polyline: [
        [13.0827, 80.2707],
        [13.0400, 80.2500],
        [13.0100, 80.2300],
        [12.9800, 80.2200]
      ],
      distanceKm: 11.2,
      durationMins: 28,
      safetyRating: 90,
      type: "primary",
    }
  ]
};

export const EMERGENCY_CONTACTS = [
  { region: "National", title: "National Disaster Response Force (NDRF)", phone: "+91-11-24363260", availability: "24/7" },
  { region: "National", title: "Indian Red Cross Emergency Help Desk", phone: "+91-11-23716441", availability: "24/7" },
  { region: "Mumbai", title: "BMC Disaster Control Room (Municipal)", phone: "1916", availability: "24/7" },
  { region: "Mumbai", title: "Mumbai Police Control Room", phone: "100", availability: "24/7" },
  { region: "New Delhi", title: "Delhi Disaster Management Authority", phone: "1077", availability: "24/7" },
  { region: "Chennai", title: "Chennai Corporation Emergency Helpline", phone: "1913", availability: "24/7" },
  { region: "Bengaluru", title: "BBMP Central Control Room", phone: "080-22221188", availability: "24/7" },
  { region: "Kolkata", title: "Kolkata Municipal Corp Emergency Line", phone: "033-22861212", availability: "24/7" },
  { region: "Hyderabad", title: "GHMC Emergency Operations Center", phone: "040-21111111", availability: "24/7" },
];
