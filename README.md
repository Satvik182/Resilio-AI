# Resilio AI – Predict. Prepare. Protect. 🌊🔥🏔️

**Resilio AI** is a professional, unified Emergency Operations Center (EOC) command console designed for disaster management authorities, emergency response teams (NDRF, NDMA, local municipal control rooms), and communities. It helps coordinate disaster preparedness, simulate progression perimeters, plan safe evacuation corridors, and manage relief shelter logistics.

---

## ⚡ Core Response Pipeline (Product Story)

The entire platform is built around a streamlined **Predict → Simulate → Alert → Evacuate → Protect** disaster-response workflow:

1. **Emergency Operations Center (EOC Console):** Live telemetry and unified command center showing the active disaster threat levels, estimated population at risk, activated shelter facilities, and deployed responder teams.
2. **AI Risk Assessment & Simulation (Step 1-3):** 
   - **Step 1:** Select target city (Mumbai, Delhi, Chennai, Kolkata, Bengaluru, Hyderabad).
   - **Step 2:** Choose disaster vector (Flood, Fire, Landslide, Disease Outbreak).
   - **Step 3:** Generate AI threat assessment (Composite Risk Score, Threat Level, Priority Action Protocols, and logistics requirements).
3. **Integrated Impact Simulation (WOW Factor):** Merges dynamic map-based timeline projections directly under the risk assessment dashboard. coordinate timeline playbacks (T+0h to T+48h) to animate disaster perimeter expansions, forecast affected citizens, and log transit/utility outages (rail networks, power substations) dynamically.
4. **Live Incident Alerts:** Real-time flashing notification bulletins with severity categories (Critical, High, Medium, Low) based on active IMD weather reports.
5. **Evacuation Corridor Planner:** Plots color-coded primary, alternate, and secondary evacuation routes with real-time Safety Score percentages, travel times, distances, and road hazard blockages warnings.
6. **Relief Camp Locator:** Monitors shelter occupancy rates, resource reserves (water, food, medical supplies), and automatically highlights the safest **AI Recommended Shelter** with lowest strain.
7. **Emergency SOS:** Direct alarm broadcasting, coordinate location sharing, and emergency hotline directories.

---

## 🤖 Judge Autopilot Demo Mode

To allow judges to evaluate the entire platform in **under 90 seconds without user interaction**, Resilio AI includes a self-navigating autopilot drive:
- Click the **"Judge Demo Mode"** button in the header or landing page.
- The platform executes a scripted Mumbai Monsoon Flood scenario, transitioning pages and modifying states:
  - **Stage 1 (0-7s):** `/dashboard` (EOC map logs Mumbai flash flood alert).
  - **Stage 2 (7-12s):** `/risk-assessment` (AI assessment runs, scoring 92/100 risk).
  - **Stage 3 (12-27s):** Auto-opens simulator block below the results and steps scrubber (0h $\to$ 48h) every 2.5s, enlarging the map circle overlay and logging rail/power grid blackouts.
  - **Stage 4 (27-35s):** `/routes` (Plots Route A [95% safe], Route B [72%], Route C [41%]).
  - **Stage 5 (35-43s):** `/camps` (Highlights safest shelter at BKC MMRDA Grounds).
  - **Stage 6 (43s+):** Redirects to `/dashboard` and locks with a **Tactical Crisis Summary Report Overlay** showing final consolidated stats (1.2M affected, 3 shelters, 91.5% success rate).

---

## 🛠️ Technology Stack

- **Framework:** Next.js (latest App Router with Turbopack compilation)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom HUD scanline command styling
- **Mapping:** Leaflet & React Leaflet (OpenStreetMap tile layers)
- **Icons:** Lucide React
- **Data Persistence:** In-memory Database Singleton (`src/lib/db.ts`)

---

## 📡 Live Trusted Data Sources

Resilio AI builds presentation trust by referencing official regional feeds:
* **IMD Weather Data:** Indian Meteorological Department forecasting feeds.
* **NDMA Guidelines:** National Disaster Management Authority safety protocols.
* **OpenStreetMap:** Live spatial street networks and topography maps.
* **Public Crisis Archives:** Historic regional cloudburst and monsoonal datasets.

---

## 🚀 Installation & Setup

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Clone the repository
```bash
git clone https://github.com/Satvik182/Resilio-AI.git
cd Resilio-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the EOC Command console.

### 4. Build for production
```bash
npm run build
npm run start
```