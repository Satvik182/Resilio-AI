import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const alerts = db.getAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, severity, category, locationName, lat, lng } = body;

    if (!title || !description || !severity || !category || !locationName || lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAlert = db.addAlert({
      title,
      description,
      severity,
      category,
      locationName,
      lat,
      lng,
      active: true,
    });

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
