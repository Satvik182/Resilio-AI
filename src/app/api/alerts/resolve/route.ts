import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    const success = db.resolveAlert(id);
    if (success) {
      return NextResponse.json({ message: "Alert resolved successfully" });
    }

    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to resolve alert" }, { status: 500 });
  }
}
