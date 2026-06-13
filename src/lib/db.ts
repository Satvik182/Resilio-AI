import { INITIAL_ALERTS, INITIAL_CAMPS, EmergencyAlert, ReliefCamp } from "./mockData";

// Simple in-memory database that persists during the Node/Next process lifetime.
class InMemoryDatabase {
  private alerts: EmergencyAlert[] = [...INITIAL_ALERTS];
  private camps: ReliefCamp[] = [...INITIAL_CAMPS];
  private assessments: any[] = [];

  constructor() {
    // If running in development, we can seed or check state
  }

  // Alerts
  getAlerts(): EmergencyAlert[] {
    return this.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getAlertById(id: string): EmergencyAlert | undefined {
    return this.alerts.find(a => a.id === id);
  }

  addAlert(alert: Omit<EmergencyAlert, "id" | "timestamp">): EmergencyAlert {
    const newAlert: EmergencyAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  resolveAlert(id: string): boolean {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.active = false;
      return true;
    }
    return false;
  }

  // Relief Camps
  getCamps(): ReliefCamp[] {
    return this.camps;
  }

  getCampById(id: string): ReliefCamp | undefined {
    return this.camps.find(c => c.id === id);
  }

  updateCampOccupancy(id: string, occupancy: number): boolean {
    const camp = this.camps.find(c => c.id === id);
    if (camp) {
      camp.occupancy = Math.min(occupancy, camp.capacity);
      if (camp.occupancy >= camp.capacity) {
        camp.status = "full";
      } else if (camp.occupancy >= camp.capacity * 0.85) {
        camp.status = "filling";
      } else if (camp.occupancy === 0) {
        camp.status = "closed";
      } else {
        camp.status = "open";
      }
      return true;
    }
    return false;
  }

  updateCampSupplies(id: string, supplyType: "water" | "food" | "medical", level: "high" | "medium" | "low" | "critical"): boolean {
    const camp = this.camps.find(c => c.id === id);
    if (camp && camp.supplies) {
      camp.supplies[supplyType] = level;
      return true;
    }
    return false;
  }

  // Assessments
  getAssessments(): any[] {
    return this.assessments;
  }

  addAssessment(assessment: any): any {
    const newAssessment = {
      ...assessment,
      id: `assess-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.assessments.unshift(newAssessment);
    return newAssessment;
  }
}

// Ensure global database singleton to prevent reset on hot module reload in Next.js
const globalForDb = globalThis as unknown as { db: InMemoryDatabase };
export const db = globalForDb.db || new InMemoryDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
export default db;
