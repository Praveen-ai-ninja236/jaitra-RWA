import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const assignedTo = searchParams.get("assigned_to") || undefined;
  const entityType = searchParams.get("entity_type") || undefined;
  const status = searchParams.get("status") || undefined;
  const list = await db.getTasks(assignedTo, entityType, status);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await db.createTask(body);
    return NextResponse.json(created);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
