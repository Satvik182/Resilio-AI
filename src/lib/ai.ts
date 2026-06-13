export interface RiskAssessmentResult {
  riskScore: number;
  location: string;
  disasterType: string;
  impactSummary: string;
  vulnerableZones: { name: string; hazardLevel: "High" | "Medium" | "Low"; description: string }[];
  recommendedActions: { phase: "Prepare" | "During" | "Recover"; action: string; priority: "High" | "Medium" | "Low" }[];
  resourceRequirements: { item: string; quantity: string; urgency: "Immediate" | "Within 24h" | "Standby" }[];
  evacuationReadiness: string;
}

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

// Deterministic mock assessments for key disaster types if AI keys are not configured.
const FALLBACK_ASSESSMENTS: Record<string, Record<string, Partial<RiskAssessmentResult>>> = {
  Flood: {
    Mumbai: {
      riskScore: 92,
      impactSummary: "Severe monsoon precipitation coinciding with a 4.9m high tide. Water levels projected to breach Mithi River safety banks by 1.8 meters, inundating low-lying residential zones.",
      vulnerableZones: [
        { name: "Kurla East & West", hazardLevel: "High", description: "Heavy street flooding, electrical substation vulnerability, high waterlogging." },
        { name: "Dharavi Sector 3", hazardLevel: "High", description: "Inundation of low-lying informal settlements, sewer backflow risks." },
        { name: "Sion/King's Circle", hazardLevel: "Medium", description: "Moderate surface water run-off causing road traffic blockages." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Deploy emergency sandbags and barrier walls around lower buildings.", priority: "High" },
        { phase: "Prepare", action: "Coordinate with ward officers to verify relief camp readiness.", priority: "High" },
        { phase: "During", action: "Evacuate low-lying residents to BKC Grounds Shelter immediately.", priority: "High" },
        { phase: "Recover", action: "Verify electrical isolation before pumping water out of flooded basements.", priority: "Medium" }
      ],
      resourceRequirements: [
        { item: "Industrial Water Pumps", quantity: "25 units", urgency: "Immediate" },
        { item: "Emergency Food & Water Rations", quantity: "8,000 units", urgency: "Immediate" },
        { item: "Rescue Inflatable Boats", quantity: "12 units", urgency: "Immediate" },
        { item: "Mobile Power Generators", quantity: "10 units", urgency: "Within 24h" }
      ],
      evacuationReadiness: "LBS Marg has severe waterlogging. Western Express Highway is clear. Route A via Santacruz-Chembur Link Road is highly recommended."
    },
    Default: {
      riskScore: 75,
      impactSummary: "Rising river levels and saturated ground soil conditions leading to flash flooding risk in low-elevation sectors.",
      vulnerableZones: [
        { name: "River Bank Corridor", hazardLevel: "High", description: "Immediate overflow risk within 300 meters." },
        { name: "Downtown Drainage Basins", hazardLevel: "Medium", description: "Storm sewer backflow flooding streets." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Clear gutters and storm drains around properties.", priority: "High" },
        { phase: "During", action: "Seek higher ground immediately. Do not attempt to drive through flooded paths.", priority: "High" },
        { phase: "Recover", action: "Watch out for electrical hazard risks from submerged outlets.", priority: "High" }
      ],
      resourceRequirements: [
        { item: "Sandbags", quantity: "1,200 units", urgency: "Immediate" },
        { item: "Emergency Boat Patrols", quantity: "2 teams", urgency: "Immediate" }
      ],
      evacuationReadiness: "Move inland away from streams. Local secondary roads remain open but slippery."
    }
  },
  Fire: {
    Delhi: {
      riskScore: 85,
      impactSummary: "Extreme dry summer winds combined with accumulated landfill heat. High probability of spark migration to adjacent industrial blocks.",
      vulnerableZones: [
        { name: "Ghazipur Landfill Border", hazardLevel: "High", description: "Dense smoke hazard, high risk of spontaneous combustion spread." },
        { name: "Okhla Industrial Phase II", hazardLevel: "High", description: "Vulnerable warehouse clusters, high concentration of packaging materials." },
        { name: "Connaught Place Blocks", hazardLevel: "Medium", description: "Historic wiring junctions, dense commercial blocks." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Conduct thermal scans of garbage mounds and activate water sprinkler grids.", priority: "High" },
        { phase: "Prepare", action: "Inspect industrial warehouse electrical shafts and fire extinguishers.", priority: "High" },
        { phase: "During", action: "Enforce a 1km exclusion zone around Ghazipur landfill. Issue N95 masks for toxic smoke.", priority: "High" },
        { phase: "Recover", action: "Conduct air quality monitoring for methane and volatile organics before lifting exclusions.", priority: "Medium" }
      ],
      resourceRequirements: [
        { item: "Foam Fire Tenders", quantity: "8 units", urgency: "Immediate" },
        { item: "HEPA Air Masks (N95)", quantity: "15,000 units", urgency: "Immediate" },
        { item: "Water Bowser Trucks", quantity: "12 units", urgency: "Immediate" }
      ],
      evacuationReadiness: "DND Flyway remains fully clear. Ring Road has heavy traffic but is navigable. Outer Ring Road is reserved for fire trucks."
    },
    Default: {
      riskScore: 68,
      impactSummary: "Elevated risk of fire spread due to high ambient temperatures, dry winds, and building material vulnerability.",
      vulnerableZones: [
        { name: "Industrial Boundary Zone", hazardLevel: "High", description: "Direct exposure to warehouse fires." },
        { name: "Residential Fringe", hazardLevel: "Medium", description: "Embers carried by wind up to 1 mile." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Remove flammable materials from balconies and patios.", priority: "High" },
        { phase: "During", action: "Evacuate immediately if local authorities issue orders. Do not wait.", priority: "High" },
        { phase: "Recover", action: "Do not return until fire safety officials declare the area fully contained.", priority: "High" }
      ],
      resourceRequirements: [
        { item: "Water Tenders", quantity: "2 units", urgency: "Immediate" },
        { item: "Emergency Shelter Cots", quantity: "500 units", urgency: "Within 24h" }
      ],
      evacuationReadiness: "Evacuate away from the wind direction. Main arterial highways are prioritized for emergency services."
    }
  },
  Landslide: {
    Shimla: {
      riskScore: 78,
      impactSummary: "Intense seasonal rainfall exceeding 140mm over 48 hours on unstable shale slopes. Slope sensors report active mud movements.",
      vulnerableZones: [
        { name: "Mall Road Bypass Ridge", hazardLevel: "High", description: "Historic mudslide corridor. Active soil sliding detected." },
        { name: "Dhalli Tunnel Approach", hazardLevel: "High", description: "High risk of boulder slips obstructing critical tunnel mouth." },
        { name: "Sanjauli Lowlands", hazardLevel: "Medium", description: "Residential structures close to steep cuts." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Inspect highway retaining walls for cracking or structural tilting.", priority: "High" },
        { phase: "Prepare", action: "Divert all surface runoff channels away from loose soil cuts.", priority: "Medium" },
        { phase: "During", action: "Halt all vehicular traffic on NH-5. Evacuate roadside slope houses.", priority: "High" },
        { phase: "Recover", action: "Clear loose rubble with heavy payloaders before restoring single-lane traffic.", priority: "High" }
      ],
      resourceRequirements: [
        { item: "Geotechnical Inclinometers", quantity: "8 sensors", urgency: "Immediate" },
        { item: "Heavy Earth Movers", quantity: "4 units", urgency: "Immediate" },
        { item: "Heavy Tarpaulins", quantity: "60 rolls", urgency: "Within 24h" }
      ],
      evacuationReadiness: "NH-5 bypass is blocked. Evacuation is guided through inner link roads towards Kalka side."
    },
    Default: {
      riskScore: 60,
      impactSummary: "High hillside soil saturation levels. Risk of localized rockfalls and mudflows along steep highway embankments.",
      vulnerableZones: [
        { name: "Highway Cut slopes", hazardLevel: "High", description: "Active rock falls possible." },
        { name: "Hillside Homes", hazardLevel: "Medium", description: "Debris flow hazard during intensive downpours." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Redirect gutter discharge away from slope faces.", priority: "High" },
        { phase: "During", action: "Stay alert while driving. Watch for collapsed pavements or fallen trees.", priority: "High" },
        { phase: "Recover", action: "Inspect foundations for new cracks or tilting structures.", priority: "Medium" }
      ],
      resourceRequirements: [
        { item: "Debris Barriers", quantity: "20 units", urgency: "Within 24h" },
        { item: "Silt Fencing", quantity: "200 meters", urgency: "Within 24h" }
      ],
      evacuationReadiness: "Keep distance from slope bases. Evacuation paths along valley floors are recommended."
    }
  },
  Disease: {
    Bengaluru: {
      riskScore: 70,
      impactSummary: "Vector-borne outbreak cluster detected in congested residential zones. Stagnant rainwater pockets and high density driving R0 index to 2.3.",
      vulnerableZones: [
        { name: "Bellandur Outer Ring Hub", hazardLevel: "High", description: "High concentration of waterlogged construction sites, high breeding density." },
        { name: "Koramangala Block 4", hazardLevel: "High", description: "Low-lying layout experiencing sewage backflows." },
        { name: "Whitefield Ward 84", hazardLevel: "Medium", description: "Localized stagnant water pools in open fields." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Initiate micro-spraying and fogging operations in high larvae density pockets.", priority: "High" },
        { phase: "Prepare", action: "Establish local health kiosks for rapid blood-smear screenings.", priority: "High" },
        { phase: "During", action: "Conduct door-to-door larval surveys. Treat water logging with chemical larvicides.", priority: "Medium" },
        { phase: "Recover", action: "Clear weed blockages in storm drains to restore smooth water flows.", priority: "High" }
      ],
      resourceRequirements: [
        { item: "Larvicide Sprayers", quantity: "30 units", urgency: "Immediate" },
        { item: "Rapid Screening Kits", quantity: "5,000 units", urgency: "Immediate" },
        { item: "Emergency Health Kiosks", quantity: "6 units", urgency: "Within 24h" }
      ],
      evacuationReadiness: "No physical roadblocks. Medical containment zones created to restrict movement inside high density wards."
    },
    Default: {
      riskScore: 55,
      impactSummary: "Localized outbreak of communicable illness. Public hygiene protocols activated to suppress further transmissions.",
      vulnerableZones: [
        { name: "Schools and Daycares", hazardLevel: "High", description: "High close-contact interaction rates." },
        { name: "Public Community Centers", hazardLevel: "Medium", description: "Shared indoor gathering halls." }
      ],
      recommendedActions: [
        { phase: "Prepare", action: "Clean high-touch surfaces multiple times daily.", priority: "High" },
        { phase: "During", action: "Isolate if showing symptoms. Practice social distancing.", priority: "High" },
        { phase: "Recover", action: "Gradually resume public events under sanitization guidelines.", priority: "Medium" }
      ],
      resourceRequirements: [
        { item: "Hand Sanitizer Rations", quantity: "500 bottles", urgency: "Immediate" },
        { item: "Informational Pamphlets", quantity: "2,000 copies", urgency: "Within 24h" }
      ],
      evacuationReadiness: "Quarantine and stay-at-home recommendations are active in localized hotspots rather than evacuation."
    }
  }
};

export async function getRiskAssessment(location: string, disasterType: string): Promise<RiskAssessmentResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const prompt = `You are a professional disaster risk assessment engine. 
Generate a comprehensive disaster risk assessment for a scenario with:
Location: "${location}"
Disaster Type: "${disasterType}"

Return the assessment as a JSON object matching this TypeScript interface:
interface RiskAssessmentResult {
  riskScore: number; // 0 to 100
  location: string;
  disasterType: string; // Flood, Fire, Landslide, or Disease
  impactSummary: string; // 2-3 sentence overview of specific threats
  vulnerableZones: { name: string; hazardLevel: "High" | "Medium" | "Low"; description: string }[]; // 2-4 zones
  recommendedActions: { phase: "Prepare" | "During" | "Recover"; action: string; priority: "High" | "Medium" | "Low" }[]; // 3-6 actions
  resourceRequirements: { item: string; quantity: string; urgency: "Immediate" | "Within 24h" | "Standby" }[]; // 3-4 items
  evacuationReadiness: string; // Brief status of evacuation routes
}

Ensure the response is STRICTLY valid JSON and contains no markdown formatting outside of JSON. Do not include \`\`\`json tags.`;

  // 1. Try Gemini API
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(cleanJsonString(text)) as RiskAssessmentResult;
        }
      }
    } catch (e) {
      console.error("Gemini API call failed, falling back:", e);
    }
  }

  // 2. Try OpenAI API
  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return JSON.parse(content) as RiskAssessmentResult;
        }
      }
    } catch (e) {
      console.error("OpenAI API call failed, falling back:", e);
    }
  }

  // 3. Fallback deterministic generator
  const lKey = Object.keys(FALLBACK_ASSESSMENTS[disasterType] || {}).find(k => 
    location.toLowerCase().includes(k.toLowerCase())
  ) || "Default";

  const disasterData = FALLBACK_ASSESSMENTS[disasterType] || FALLBACK_ASSESSMENTS["Flood"];
  const assessment = disasterData[lKey] || disasterData["Default"];

  return {
    riskScore: assessment.riskScore || 70,
    location,
    disasterType,
    impactSummary: assessment.impactSummary || "Slightly elevated hazard potential based on regional history and current meteorological reports.",
    vulnerableZones: assessment.vulnerableZones || [],
    recommendedActions: assessment.recommendedActions || [],
    resourceRequirements: assessment.resourceRequirements || [],
    evacuationReadiness: assessment.evacuationReadiness || "Evacuation corridors are open. Heavy monitoring active."
  };
}

export async function generateChatResponse(
  history: ChatMessage[],
  newMessage: string
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const systemInstructions = `You are "Resilio AI Assistant", an expert disaster preparedness, crisis management, and emergency response agent. 
Provide clear, actionable, and structured guidance. Use bullet points, clear headings, and highlight high-risk items. 
Always prioritize life safety. If the user indicates a live emergency, urge them to dial 911 (or their local equivalent) and follow official orders.
Keep explanations concise and practical.`;

  // 1. Try Gemini API
  if (geminiKey) {
    try {
      const geminiHistory = history.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }]
      }));
      geminiHistory.push({ role: "user", parts: [{ text: newMessage }] });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiHistory,
            systemInstruction: { parts: [{ text: systemInstructions }] }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.error("Gemini Chat API call failed:", e);
    }
  }

  // 2. Try OpenAI API
  if (openaiKey) {
    try {
      const openaiMessages = [
        { role: "system", content: systemInstructions },
        ...history.map(msg => ({
          role: msg.role === "model" ? "assistant" : msg.role,
          content: msg.content
        })),
        { role: "user", content: newMessage }
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openaiMessages
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (e) {
      console.error("OpenAI Chat API call failed:", e);
    }
  }

  // 3. Smart local response generator
  return getMockAssistantResponse(newMessage);
}

function cleanJsonString(str: string): string {
  // Strip any markdown code blocks if the model returned them
  let clean = str.trim();
  if (clean.startsWith("```json")) {
    clean = clean.substring(7);
  } else if (clean.startsWith("```")) {
    clean = clean.substring(3);
  }
  if (clean.endsWith("```")) {
    clean = clean.substring(0, clean.length - 3);
  }
  return clean.trim();
}

function getMockAssistantResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("flood") || q.includes("water") || q.includes("rain")) {
    return `### Flood Preparedness & Safety Guidance 🌊

If you are facing an imminent threat or active flash flood warning:
1. **Move to Higher Ground:** Walk or drive immediately to high ground. Avoid basements or lower floors.
2. **Turn Around, Don't Drown:** Just 15 cm (6 inches) of moving water can sweep you off your feet; 30 cm (1 foot) can float or stall a small car.
3. **Turn Off Utilities:** Shut off gas, water, and main electrical breakers if instructed or before water breaches your property (and if you are completely dry).

**Emergency Kit Checklist for Floods:**
* ✓ Clean drinking water (4 liters per person per day, 3-day supply minimum).
* ✓ Sealed non-perishable foods.
* ✓ Hand-crank or battery-powered weather radio.
* ✓ Waterproof flashlight + backup batteries.
* ✓ First-aid kit + essential personal prescriptions.
* ✓ Laminated copies of emergency IDs and contacts.`;
  }

  if (q.includes("fire") || q.includes("wildfire") || q.includes("smoke")) {
    return `### Wildfire Preparation & Evacuation Protocols 🔥

**1. Create a Defensible Space:**
* Remove dead plants, pine needles, and dry leaves within **10 meters (30 feet)** of all buildings.
* Move wood piles, propane tanks, and flammable yard furniture away from the walls.

**2. Imminent Evacuation Actions (Go-Bag Checklist):**
* **Important Documents:** Passports, birth certificates, deeds, insurance papers in a fireproof pouch.
* **N95 Masks:** To filter fine smoke particles during escape.
* **Protective Wear:** Sturdy leather gloves, long-sleeve cotton/wool shirts, pants, and heavy boots.
* **Car Readiness:** Keep your vehicle parked facing out in the driveway, with windows rolled up and keys in the ignition.

**During Wildfire Smoke Conditions:**
* Keep windows and doors tightly closed.
* Set HVAC to **Recirculate** and install high-MERV HEPA filters.`;
  }

  if (q.includes("earthquake") || q.includes("shake") || q.includes("tremor")) {
    return `### Earthquake Drop, Cover, and Hold On Protocol 🫨

If shaking begins, perform these actions instantly:

1. **DROP:** Get down on your hands and knees. This protects you from being knocked over and allows you to crawl to shelter.
2. **COVER:** Take cover under a sturdy table, desk, or next to an interior wall. Protect your head and neck with your arms.
3. **HOLD ON:** Hold onto your shelter with one hand and protect your head/neck with the other. Stay in place until shaking stops completely.

**Things to AVOID:**
* ❌ **Do not run outside:** Falling masonry, glass, and exterior cladding are the leading causes of earthquake injuries.
* ❌ **Do not stand in doorways:** Modern doorways are not stronger than the rest of standard walls and do not protect you from flying debris.
* ❌ **Avoid elevators:** Elevators will automatically halt and power grids may fail.`;
  }

  if (q.includes("bag") || q.includes("kit") || q.includes("prepare") || q.includes("supply")) {
    return `### Emergency "Go-Bag" Essential List 🎒

An emergency go-bag should contain enough supplies to sustain you and your family for **at least 72 hours** in the event of an evacuation.

**The Essentials:**
1. **Water:** 1 gallon (3.8 liters) per person per day (for drinking and basic hygiene).
2. **Food:** 3-day supply of non-perishable, easy-to-prepare food (canned goods, energy bars).
3. **Light:** Heavy-duty LED flashlights or headlamps with extra batteries.
4. **First Aid:** Bandages, antiseptics, sterile gauze, burn cream, safety pins, scissors, and a 7-day supply of personal prescription medications.
5. **Power:** Pre-charged USB power bank + matching phone chargers.
6. **Shelter/Warmth:** Emergency space blankets (Mylar) and a rain poncho.
7. **Hygiene:** Wet wipes, garbage bags, hand sanitizer, travel-size soap, and toothbrushes.
8. **Cash:** Small bills ($1, $5, $10, $20) as ATMs and card readers will fail if communications or power is down.`;
  }

  return `### Resilio AI Preparedness Assistant 🤖

I am here to help you prepare, navigate, and recover from disaster events. I can answer questions about:
* **Floods:** Flash flood safety, barrier deployments, and utility shutdowns.
* **Wildfires:** Defensible zones, air filtration, and wildfire go-bags.
* **Earthquakes:** Drop-cover-hold protocols and structural safety guidelines.
* **Evacuations:** General planning, emergency supplies, and route safety.

*Please tell me what disaster scenario you would like to prepare for, or ask me for an emergency checklist.*`;
}
