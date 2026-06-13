import { NextResponse } from "next/server";
import { getRiskAssessment } from "@/lib/ai";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, disasterType } = body;

    if (!location || !disasterType) {
      return NextResponse.json({ error: "Location and disasterType are required" }, { status: 400 });
    }

    const assessment = await getRiskAssessment(location, disasterType);
    
    // Save to database assessments log
    db.addAssessment(assessment);

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Risk assessment API error:", error);
    return NextResponse.json({ error: "Failed to generate risk assessment" }, { status: 500 });
  }
}
