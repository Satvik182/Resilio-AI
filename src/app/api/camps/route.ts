import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const camps = db.getCamps();
    return NextResponse.json(camps);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch relief camps" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, occupancy, supplyType, supplyLevel } = body;

    if (!id) {
      return NextResponse.json({ error: "Camp ID is required" }, { status: 400 });
    }

    if (action === "updateOccupancy") {
      if (occupancy === undefined) {
        return NextResponse.json({ error: "Occupancy is required" }, { status: 400 });
      }
      const success = db.updateCampOccupancy(id, occupancy);
      if (success) {
        return NextResponse.json({ message: "Occupancy updated successfully", camp: db.getCampById(id) });
      }
    } else if (action === "updateSupplies") {
      if (!supplyType || !supplyLevel) {
        return NextResponse.json({ error: "supplyType and supplyLevel are required" }, { status: 400 });
      }
      const success = db.updateCampSupplies(id, supplyType, supplyLevel);
      if (success) {
        return NextResponse.json({ message: "Supplies updated successfully", camp: db.getCampById(id) });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ error: "Camp not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update camp details" }, { status: 500 });
  }
}
